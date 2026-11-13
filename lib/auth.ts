import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { compare, hash } from 'bcryptjs'
import { asNumber, db, nowIso } from './db'
import type { AdminUser } from './types'

type Row = Record<string, unknown>

export const SESSION_COOKIE_NAME = 'samar_admin_session'
const SESSION_HOURS = Math.min(
  72,
  Math.max(1, Number(process.env.ADMIN_SESSION_HOURS) || 8),
)
const SESSION_MS = SESSION_HOURS * 60 * 60 * 1000
const SESSION_COOKIE_MAX_AGE = Math.floor(SESSION_MS / 1000)
const BCRYPT_ROUNDS = 12

/**
 * A valid bcrypt hash used only to keep failed-login timing similar when no
 * matching admin exists. It is not a credential.
 */
const DUMMY_HASH = '$2b$12$H14Qof86.8lRQKr/eFTJg.j3JqnHhnzS0p4ruhPq9UkzWcAq8gDvW'

export type AdminSession = {
  admin: AdminUser
  tokenHash: string
  expiresAt: string
  sessionHours: number
}

function mapAdmin(row: Row): AdminUser {
  return {
    id: asNumber(row.id),
    email: String(row.email),
    name: String(row.name),
    createdAt: String(row.created_at),
  }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getAdminByEmail(email: string): (AdminUser & { passwordHash: string }) | null {
  const row = db
    .prepare('SELECT * FROM admin_users WHERE email = ? COLLATE NOCASE LIMIT 1')
    .get(normalizeEmail(email)) as Row | undefined
  if (!row) return null
  return {
    ...mapAdmin(row),
    passwordHash: String(row.password_hash),
  }
}

export function getAdminById(id: number): AdminUser | null {
  const row = db.prepare('SELECT * FROM admin_users WHERE id = ? LIMIT 1').get(id) as
    | Row
    | undefined
  return row ? mapAdmin(row) : null
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  const admin = getAdminByEmail(email)
  if (!admin) {
    // Equalize timing so the endpoint does not reveal whether the email exists.
    await compare(password, DUMMY_HASH)
    return null
  }
  const matches = await compare(password, admin.passwordHash)
  if (!matches) return null
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    createdAt: admin.createdAt,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS)
}

export function createSession(adminId: number): {
  token: string
  expiresAt: string
} {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = hashToken(token)
  const createdAt = nowIso()
  const expiresAt = new Date(Date.now() + SESSION_MS).toISOString()

  db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(createdAt)
  db.prepare(
    `INSERT INTO admin_sessions (token_hash, admin_id, expires_at, created_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(tokenHash, adminId, expiresAt, createdAt, createdAt)

  return { token, expiresAt }
}

export function getSessionCookieOptions(expiresAt: string) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
    maxAge: SESSION_COOKIE_MAX_AGE,
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const tokenHash = hashToken(token)
  const row = db
    .prepare(
      `SELECT s.token_hash, s.expires_at, s.last_seen_at,
              u.id, u.email, u.name, u.created_at
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.admin_id
       WHERE s.token_hash = ?
       LIMIT 1`,
    )
    .get(tokenHash) as Row | undefined

  if (!row) return null

  const expiresAt = String(row.expires_at)
  if (new Date(expiresAt).getTime() <= Date.now()) {
    db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash)
    return null
  }

  const lastSeen = new Date(String(row.last_seen_at)).getTime()
  if (Number.isNaN(lastSeen) || Date.now() - lastSeen > 5 * 60 * 1000) {
    db.prepare('UPDATE admin_sessions SET last_seen_at = ? WHERE token_hash = ?').run(
      nowIso(),
      tokenHash,
    )
  }

  return {
    admin: mapAdmin(row),
    tokenHash,
    expiresAt,
    sessionHours: SESSION_HOURS,
  }
}

export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return session
}

export function destroySession(tokenHash: string): void {
  db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash)
}

export function destroyAllSessions(): void {
  db.prepare('DELETE FROM admin_sessions').run()
}

export async function updateAdminPassword(adminId: number, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword)
  db.prepare('UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
    passwordHash,
    nowIso(),
    adminId,
  )
}
