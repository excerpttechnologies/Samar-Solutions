/**
 * Single source of truth for the SQLite schema.
 *
 * Imported by both the Next.js data layer (`lib/db.ts`) and the
 * environment-based admin setup scripts (`scripts/create-admin.mjs`).
 */
export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  email         TEXT NOT NULL COLLATE NOCASE UNIQUE,
  name          TEXT NOT NULL DEFAULT 'Administrator',
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash   TEXT PRIMARY KEY,
  admin_id     INTEGER NOT NULL DEFAULT 1,
  expires_at   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL COLLATE NOCASE UNIQUE,
  slug        TEXT NOT NULL COLLATE NOCASE UNIQUE,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  title                 TEXT NOT NULL,
  slug                  TEXT NOT NULL COLLATE NOCASE UNIQUE,
  short_description     TEXT NOT NULL,
  detailed_description  TEXT,
  category_id           INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  client_name           TEXT,
  project_location      TEXT,
  start_date            TEXT,
  completion_date       TEXT,
  project_status        TEXT NOT NULL DEFAULT 'Completed',
  technologies          TEXT NOT NULL DEFAULT '[]',
  features              TEXT NOT NULL DEFAULT '[]',
  highlights            TEXT NOT NULL DEFAULT '[]',
  tags                  TEXT NOT NULL DEFAULT '[]',
  seo_title             TEXT,
  seo_description       TEXT,
  seo_keywords          TEXT,
  cover_image           TEXT,
  cover_image_alt       TEXT,
  video_url             TEXT,
  status                TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured              INTEGER NOT NULL DEFAULT 0,
  published_at          TEXT,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published_at);

CREATE TABLE IF NOT EXISTS project_media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id  INTEGER NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('gallery', 'document')),
  url         TEXT NOT NULL,
  filename    TEXT,
  alt_text    TEXT,
  caption     TEXT,
  mime_type   TEXT,
  size_bytes  INTEGER,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id, kind, sort_order);

CREATE TABLE IF NOT EXISTS media (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  url           TEXT NOT NULL UNIQUE,
  filename      TEXT NOT NULL,
  original_name TEXT,
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL DEFAULT 0,
  width         INTEGER,
  height        INTEGER,
  kind          TEXT NOT NULL CHECK (kind IN ('image', 'document', 'video')),
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at);

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT OR IGNORE INTO categories (name, slug, description, sort_order) VALUES
  ('Solar', 'solar', 'Solar rooftop and renewable-energy projects.', 1),
  ('EV Charging', 'ev-charging', 'Electric-vehicle charging infrastructure projects.', 2),
  ('EPC', 'epc', 'Engineering, procurement, and construction projects.', 3);
`
