# SAMAR Solutions — Admin Panel

The public website and the admin panel share one Next.js application and one
SQLite database. There is exactly **one** administrator account. There is no
registration, no employee/project-manager/contributor account, and no user-role
management.

## 1. Create the administrator

Credentials are never stored in frontend code or returned by an API. Create the
account from the server with environment variables:

```bash
# PowerShell
$env:ADMIN_EMAIL="admin@your-domain.com"
$env:ADMIN_PASSWORD="use-a-long-unique-password"
$env:ADMIN_NAME="Website Administrator"
npm run admin:create
```

Or copy `.env.example` to `.env.local`, fill in `ADMIN_EMAIL`,
`ADMIN_PASSWORD`, and `ADMIN_NAME`, then run `npm run admin:create`.
`.env.local` is ignored by git.

To reset a forgotten password (revokes all active sessions):

```bash
npm run admin:reset
```

You can also change the password from **Admin → Website Settings** while signed
in. Sign in at `/admin/login`.

## 2. Data storage

- SQLite database: `data/samar.db` (created automatically; ignored by git).
- Uploaded media: `public/uploads/YYYY/MM/` (ignored by git).
- Uploaded images are validated with `sharp`, resized to a maximum of
  2400 × 2400 px, and converted to WEBP (quality 82).
- Images: JPG/JPEG/PNG/WEBP, max 12 MB.
- Documents: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, CSV, max 25 MB.
- Videos: MP4/WEBM, max 80 MB.

For a production deployment, mount persistent storage for both `data/` and
`public/uploads/`, or replace the local upload writer with object storage.
Vercel's default filesystem is ephemeral.

## 3. Admin routes

| Route | Purpose |
| --- | --- |
| `/admin/login` | Administrator sign-in (no registration) |
| `/admin/dashboard` | Counts, recent projects, quick actions |
| `/admin/projects` | Search, filter, paginate, publish, archive, duplicate, delete |
| `/admin/projects/new` | Create a project |
| `/admin/projects/[id]/edit` | Edit a project, media, and SEO |
| `/admin/categories` | Category CRUD |
| `/admin/media` | Media library |
| `/admin/settings` | Website contact settings + password change |

All `/admin/*` pages except `/admin/login` require a valid session. Unauthenticated
visitors are redirected to `/admin/login`.

## 4. API routes

### Authentication

| Method | Route |
| --- | --- |
| POST | `/api/admin/auth/login` |
| POST | `/api/admin/auth/logout` |
| GET | `/api/admin/auth/me` |
| POST | `/api/admin/auth/change-password` |

### Admin (session required)

| Method | Route |
| --- | --- |
| GET / POST | `/api/admin/projects` |
| GET / PUT / DELETE | `/api/admin/projects/:id` |
| POST | `/api/admin/projects/:id/publish` |
| POST | `/api/admin/projects/:id/unpublish` |
| POST | `/api/admin/projects/:id/archive` |
| POST | `/api/admin/projects/:id/restore` |
| POST | `/api/admin/projects/:id/duplicate` |
| GET / POST | `/api/admin/categories` |
| PUT / DELETE | `/api/admin/categories/:id` |
| GET / POST | `/api/admin/media` (POST is multipart upload) |
| DELETE | `/api/admin/media/:id` |
| GET / PUT | `/api/admin/settings` |

### Public

| Method | Route |
| --- | --- |
| GET | `/api/public/projects?category=&page=&pageSize=` |
| GET | `/api/public/projects/:slug` |

Only `published` projects are returned publicly. Drafts and archived projects
return 404 and are not listed.

## 5. Security notes

- Passwords are hashed with bcrypt (cost 12).
- Sessions use 256-bit random tokens stored only as SHA-256 hashes in SQLite.
- The session cookie is `HttpOnly`, `SameSite=Lax`, `Secure` in production,
  and expires after `ADMIN_SESSION_HOURS` (default 8).
- Login is rate-limited (per IP and per account/IP) with a 15-minute window.
- Admin mutations verify the request origin (CSRF protection) and require a
  valid session.
- All input is validated again on the server; uploads are validated by content
  where applicable.
- There is no registration endpoint and no second account path.

## 6. Local development

```bash
npm install
npm run admin:create
npm run dev
```

Open `http://localhost:3000` for the public website and
`http://localhost:3000/admin/login` for the panel.
