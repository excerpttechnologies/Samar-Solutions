import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { SCHEMA_SQL } from './schema.mjs'

export const DATABASE_PATH = process.env.DATABASE_PATH
  ? path.isAbsolute(process.env.DATABASE_PATH)
    ? process.env.DATABASE_PATH
    : path.join(process.cwd(), process.env.DATABASE_PATH)
  : path.join(process.cwd(), 'data', 'samar.db')

type GlobalWithDb = typeof globalThis & { __samarDb?: DatabaseSync }

function openDatabase(): DatabaseSync {
  fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true })
  const database = new DatabaseSync(DATABASE_PATH)
  database.exec('PRAGMA journal_mode = WAL;')
  database.exec('PRAGMA foreign_keys = ON;')
  database.exec('PRAGMA busy_timeout = 5000;')
  database.exec(SCHEMA_SQL)
  return database
}

const globalWithDb = globalThis as GlobalWithDb

export const db = globalWithDb.__samarDb ?? openDatabase()

// Reuse one connection through development hot reloads.
if (process.env.NODE_ENV !== 'production') {
  globalWithDb.__samarDb = db
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }
  if (typeof value !== 'string' || !value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export function asNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  return Number(value ?? 0)
}

export function transaction<T>(work: () => T): T {
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = work()
    db.exec('COMMIT')
    return result
  } catch (error) {
    try {
      db.exec('ROLLBACK')
    } catch {
      // The original error is more useful than a rollback failure.
    }
    throw error
  }
}

export function isUniqueConstraintError(error: unknown, column?: string): boolean {
  const message = error instanceof Error ? error.message : String(error)
  if (!message.includes('UNIQUE constraint failed')) return false
  return column ? message.includes(column) : true
}
