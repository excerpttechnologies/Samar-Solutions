#!/usr/bin/env node
/**
 * Create or reset the single administrator account.
 *
 * Usage (recommended):
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='strong-password' npm run admin:create
 *
 * Reset an existing account:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='new-strong-password' npm run admin:reset
 *
 * The password is read from the environment only. It is never written to the
 * repository, printed to the console, or sent from the browser.
 */
import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { hash } from 'bcryptjs'
import { SCHEMA_SQL } from '../lib/schema.mjs'

/**
 * Load local env files as a fallback. Some shells define an empty variable
 * (e.g. ADMIN_EMAIL="") which prevents Node's --env-file from overriding it.
 */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return
  for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator < 1) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(path.join(process.cwd(), '.env.local'))
loadEnvFile(path.join(process.cwd(), '.env'))

const reset = process.argv.includes('--reset') || process.env.ADMIN_RESET === '1'
const email = String(process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
const password = String(process.env.ADMIN_PASSWORD ?? '')
const name = String(process.env.ADMIN_NAME ?? '').trim() || 'Administrator'

function fail(message) {
  console.error(`\nError: ${message}\n`)
  process.exit(1)
}

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  fail('Set ADMIN_EMAIL to a valid email address.')
}
if (!password || password.length < 10) {
  fail('Set ADMIN_PASSWORD to a password with at least 10 characters.')
}
if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
  fail('ADMIN_PASSWORD must include at least one letter and one number.')
}

const dbPath = process.env.DATABASE_PATH
  ? path.isAbsolute(process.env.DATABASE_PATH)
    ? process.env.DATABASE_PATH
    : path.join(process.cwd(), process.env.DATABASE_PATH)
  : path.join(process.cwd(), 'data', 'samar.db')

fs.mkdirSync(path.dirname(dbPath), { recursive: true })
const db = new DatabaseSync(dbPath)
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')
db.exec(SCHEMA_SQL)

const existing = db.prepare('SELECT id, email FROM admin_users WHERE id = 1').get()

if (existing && !reset) {
  db.close()
  fail(
    'An administrator account already exists. Run "npm run admin:reset" with ADMIN_EMAIL and ADMIN_PASSWORD to reset it.',
  )
}

const passwordHash = await hash(password, 12)
const now = new Date().toISOString()

db.exec('BEGIN IMMEDIATE')
try {
  if (existing) {
    db.prepare(
      `UPDATE admin_users
       SET email = ?, name = ?, password_hash = ?, updated_at = ?
       WHERE id = 1`,
    ).run(email, name, passwordHash, now)
    db.prepare('DELETE FROM admin_sessions').run()
  } else {
    db.prepare(
      `INSERT INTO admin_users (id, email, name, password_hash, created_at, updated_at)
       VALUES (1, ?, ?, ?, ?, ?)`,
    ).run(email, name, passwordHash, now, now)
  }
  db.exec('COMMIT')
} catch (error) {
  try {
    db.exec('ROLLBACK')
  } catch {
    // Ignore rollback failure and report the original error.
  }
  db.close()
  fail(error instanceof Error ? error.message : String(error))
}

db.close()

console.log(`\n${existing ? 'Updated' : 'Created'} administrator account.`)
console.log(`Email: ${email}`)
console.log('Password: set from ADMIN_PASSWORD (not displayed).')
console.log(`Database: ${dbPath}`)
if (existing) console.log('All existing admin sessions have been revoked.')
console.log('\nSign in at /admin/login\n')
