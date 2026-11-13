import { db, nowIso } from './db'
import { site } from './site'
import type { SiteSettings } from './types'

type Row = Record<string, unknown>

const KEYS = {
  partnership: 'partnership',
  phone: 'contact_phone',
  email: 'contact_email',
  address: 'contact_address',
  hours: 'contact_hours',
} as const

const DEFAULTS: SiteSettings = {
  partnership: site.partnership,
  phone: site.contact.phone,
  email: site.contact.email,
  address: site.contact.address,
  hours: site.contact.hours,
}

function readSettingsRows(): Map<string, string> {
  const rows = db.prepare('SELECT key, value FROM settings').all() as Row[]
  return new Map(rows.map((row) => [String(row.key), String(row.value)]))
}

function fromRow(
  rows: Map<string, string>,
  key: string,
  fallback: string | null,
): string | null {
  if (!rows.has(key)) return fallback
  const value = rows.get(key)?.trim()
  return value ? value : null
}

export function getSiteSettings(): SiteSettings {
  const rows = readSettingsRows()
  return {
    partnership: fromRow(rows, KEYS.partnership, DEFAULTS.partnership),
    phone: fromRow(rows, KEYS.phone, DEFAULTS.phone),
    email: fromRow(rows, KEYS.email, DEFAULTS.email),
    address: fromRow(rows, KEYS.address, DEFAULTS.address),
    hours: fromRow(rows, KEYS.hours, DEFAULTS.hours),
  }
}

export function updateSiteSettings(input: SiteSettings): SiteSettings {
  const timestamp = nowIso()
  const statement = db.prepare(
    `INSERT INTO settings (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  )

  const pairs: [string, string | null][] = [
    [KEYS.partnership, input.partnership],
    [KEYS.phone, input.phone],
    [KEYS.email, input.email],
    [KEYS.address, input.address],
    [KEYS.hours, input.hours],
  ]

  for (const [key, value] of pairs) {
    statement.run(key, value?.trim() ?? '', timestamp)
  }

  return getSiteSettings()
}
