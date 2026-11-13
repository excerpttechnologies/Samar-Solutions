import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp, { type Metadata, type OutputInfo } from 'sharp'
import { asNumber, db, nowIso } from './db'
import type { MediaAsset } from './types'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
export const UPLOAD_ROOT = path.join(PUBLIC_DIR, 'uploads')

const MAX_IMAGE_BYTES = 12 * 1024 * 1024
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024
const MAX_VIDEO_BYTES = 80 * 1024 * 1024

const DOCUMENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
}

const VIDEO_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
}

type MediaRow = Record<string, unknown>

export class UploadError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'UploadError'
    this.status = status
  }
}

function mapMedia(row: MediaRow): MediaAsset {
  return {
    id: asNumber(row.id),
    url: String(row.url),
    filename: String(row.filename),
    originalName: row.original_name ? String(row.original_name) : null,
    mimeType: String(row.mime_type),
    sizeBytes: asNumber(row.size_bytes),
    width: row.width === null ? null : asNumber(row.width),
    height: row.height === null ? null : asNumber(row.height),
    kind: String(row.kind) as MediaAsset['kind'],
    createdAt: String(row.created_at),
  }
}

function isUploadFile(value: unknown): value is File {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as File).arrayBuffer === 'function' &&
    typeof (value as File).size === 'number'
  )
}

function safeOriginalName(name: string): string {
  return (
    name
      .replace(/[\\/]/g, '-')
      .replace(/[\u0000-\u001f\u007f]/g, '')
      .trim()
      .slice(0, 250) || 'file'
  )
}

function extensionOf(name: string): string {
  const index = name.lastIndexOf('.')
  if (index < 0) return ''
  return name.slice(index + 1).toLowerCase()
}

function datedFolder(): { folder: string; urlSegment: string } {
  const now = new Date()
  const year = String(now.getUTCFullYear())
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return {
    folder: path.join(UPLOAD_ROOT, year, month),
    urlSegment: `${year}/${month}`,
  }
}

function insertMediaRow(input: {
  url: string
  filename: string
  originalName: string
  mimeType: string
  sizeBytes: number
  width: number | null
  height: number | null
  kind: MediaAsset['kind']
}): MediaAsset {
  const result = db
    .prepare(
      `INSERT INTO media
        (url, filename, original_name, mime_type, size_bytes, width, height, kind, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.url,
      input.filename,
      input.originalName,
      input.mimeType,
      input.sizeBytes,
      input.width,
      input.height,
      input.kind,
      nowIso(),
    )
  const row = db
    .prepare('SELECT * FROM media WHERE id = ?')
    .get(asNumber(result.lastInsertRowid)) as MediaRow
  return mapMedia(row)
}

async function saveImage(file: File): Promise<MediaAsset> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError('Images must be 12 MB or smaller.')
  }
  const buffer = Buffer.from(await file.arrayBuffer())

  let metadata: Metadata
  try {
    metadata = await sharp(buffer, {
      failOn: 'error',
      limitInputPixels: 50_000_000,
    }).metadata()
  } catch {
    throw new UploadError('The selected file is not a readable image.')
  }

  if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
    throw new UploadError('Upload a JPG, JPEG, PNG, or WEBP image.')
  }

  let processed: { data: Buffer; info: OutputInfo }
  try {
    processed = await sharp(buffer, { failOn: 'error', limitInputPixels: 50_000_000 })
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer({ resolveWithObject: true })
  } catch {
    throw new UploadError('The image could not be processed.')
  }

  const { folder, urlSegment } = datedFolder()
  fs.mkdirSync(folder, { recursive: true })
  const filename = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.webp`
  const filePath = path.join(folder, filename)
  fs.writeFileSync(filePath, processed.data)

  const url = `/uploads/${urlSegment}/${filename}`.replace(/\\/g, '/')
  try {
    return insertMediaRow({
      url,
      filename,
      originalName: safeOriginalName(file.name || 'image'),
      mimeType: 'image/webp',
      sizeBytes: processed.data.length,
      width: processed.info.width,
      height: processed.info.height,
      kind: 'image',
    })
  } catch (error) {
    fs.rmSync(filePath, { force: true })
    throw error
  }
}

function validateDocumentBuffer(buffer: Buffer, extension: string) {
  if (extension === 'pdf' && buffer.subarray(0, 5).toString() !== '%PDF-') {
    throw new UploadError('The selected file is not a valid PDF.')
  }
  if (['docx', 'xlsx', 'pptx'].includes(extension)) {
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
      throw new UploadError('The selected file is not a valid Office document.')
    }
  }
  if (['doc', 'xls', 'ppt'].includes(extension)) {
    if (
      buffer[0] !== 0xd0 ||
      buffer[1] !== 0xcf ||
      buffer[2] !== 0x11 ||
      buffer[3] !== 0xe0
    ) {
      throw new UploadError('The selected file is not a valid Office document.')
    }
  }
  if (['txt', 'csv'].includes(extension) && buffer.includes(0)) {
    throw new UploadError('The selected file does not appear to be plain text.')
  }
}

function validateVideoBuffer(buffer: Buffer, extension: string) {
  if (extension === 'mp4' && buffer.subarray(4, 8).toString() !== 'ftyp') {
    throw new UploadError('The selected file is not a valid MP4 video.')
  }
  if (extension === 'webm' && (buffer[0] !== 0x1a || buffer[1] !== 0x45)) {
    throw new UploadError('The selected file is not a valid WEBM video.')
  }
}

function writeBuffer(
  buffer: Buffer,
  extension: string,
  mimeType: string,
  originalName: string,
  kind: MediaAsset['kind'],
): MediaAsset {
  const { folder, urlSegment } = datedFolder()
  fs.mkdirSync(folder, { recursive: true })
  const filename = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${extension}`
  const filePath = path.join(folder, filename)
  fs.writeFileSync(filePath, buffer)

  const url = `/uploads/${urlSegment}/${filename}`.replace(/\\/g, '/')
  try {
    return insertMediaRow({
      url,
      filename,
      originalName,
      mimeType,
      sizeBytes: buffer.length,
      width: null,
      height: null,
      kind,
    })
  } catch (error) {
    fs.rmSync(filePath, { force: true })
    throw error
  }
}

export async function saveUpload(file: unknown, kind: string): Promise<MediaAsset> {
  if (!isUploadFile(file) || file.size <= 0) {
    throw new UploadError('Choose a file to upload.')
  }

  if (kind === 'image') return saveImage(file)

  const originalName = safeOriginalName(
    file.name || (kind === 'video' ? 'video' : 'document'),
  )
  const extension = extensionOf(originalName)
  const buffer = Buffer.from(await file.arrayBuffer())

  if (kind === 'document') {
    if (buffer.length > MAX_DOCUMENT_BYTES) {
      throw new UploadError('Documents must be 25 MB or smaller.')
    }
    const mimeType = DOCUMENT_TYPES[extension]
    if (!mimeType) {
      throw new UploadError(
        'Documents must be PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, or CSV files.',
      )
    }
    validateDocumentBuffer(buffer, extension)
    return writeBuffer(buffer, extension, mimeType, originalName, 'document')
  }

  if (kind === 'video') {
    if (buffer.length > MAX_VIDEO_BYTES) {
      throw new UploadError('Videos must be 80 MB or smaller.')
    }
    const mimeType = VIDEO_TYPES[extension]
    if (!mimeType) {
      throw new UploadError('Videos must be MP4 or WEBM files.')
    }
    validateVideoBuffer(buffer, extension)
    return writeBuffer(buffer, extension, mimeType, originalName, 'video')
  }

  throw new UploadError('Unsupported upload type.')
}

export function listMedia({
  kind,
  page = 1,
  pageSize = 24,
}: {
  kind?: MediaAsset['kind'] | 'all'
  page?: number
  pageSize?: number
} = {}): {
  items: MediaAsset[]
  total: number
  page: number
  pageSize: number
  totalPages: number
} {
  const safePage = Math.max(1, Math.floor(page))
  const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)))
  const where = kind && kind !== 'all' ? 'WHERE kind = ?' : ''
  const params: (string | number)[] = kind && kind !== 'all' ? [kind] : []

  const count = db
    .prepare(`SELECT COUNT(*) AS count FROM media ${where}`)
    .get(...params) as MediaRow
  const total = asNumber(count.count)
  const rows = db
    .prepare(
      `SELECT * FROM media ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, safeSize, (safePage - 1) * safeSize) as MediaRow[]

  return {
    items: rows.map(mapMedia),
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: total === 0 ? 0 : Math.ceil(total / safeSize),
  }
}

export function getMediaUsageCount(url: string): number {
  const row = db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM projects WHERE cover_image = ? OR video_url = ?) AS project_refs,
        (SELECT COUNT(*) FROM project_media WHERE url = ?) AS media_refs`,
    )
    .get(url, url, url) as MediaRow
  return asNumber(row.project_refs) + asNumber(row.media_refs)
}

export function deleteMediaAsset(id: number): void {
  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(id) as
    | MediaRow
    | undefined
  if (!row) throw new UploadError('Media item not found.', 404)

  const url = String(row.url)
  const references = getMediaUsageCount(url)
  if (references > 0) {
    throw new UploadError(
      'This file is still used by a project. Remove it from the project before deleting it.',
      409,
    )
  }

  db.prepare('DELETE FROM media WHERE id = ?').run(id)
  deleteStoredFile(url)
}

export function deleteStoredFile(url: string): void {
  if (!url.startsWith('/uploads/')) return
  const resolved = path.resolve(PUBLIC_DIR, `.${url}`)
  if (!resolved.startsWith(`${UPLOAD_ROOT}${path.sep}`)) return
  try {
    fs.rmSync(resolved, { force: true })
  } catch {
    // The database record is already gone; do not fail the request.
  }
}
