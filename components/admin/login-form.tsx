'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { ApiRequestError, apiFetch } from '@/lib/api-client'
import { adminInputClass, adminLabelClass, adminPrimaryButtonClass } from './form-styles'

export function LoginForm() {
  const id = useId()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setBusy(true)

    try {
      await apiFetch('/api/admin/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      router.replace('/admin/dashboard')
      router.refresh()
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setError(caught.message)
        setFieldErrors(caught.fields)
      } else {
        setError('Unable to sign in right now. Please try again.')
      }
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div>
        <label htmlFor={`${id}-email`} className={adminLabelClass}>
          Email address
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-[1.55rem] size-4 text-muted-foreground"
          />
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? `${id}-email-error` : undefined}
            className={`${adminInputClass} pl-10`}
            placeholder="admin@example.com"
          />
        </div>
        {fieldErrors.email && (
          <p id={`${id}-email-error`} className="mt-1.5 text-sm text-destructive">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-password`} className={adminLabelClass}>
          Password
        </label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-[1.55rem] size-4 text-muted-foreground"
          />
          <input
            id={`${id}-password`}
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={fieldErrors.password ? `${id}-password-error` : undefined}
            className={`${adminInputClass} pl-10 pr-11`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-[1.35rem] rounded p-1.5 text-muted-foreground hover:bg-muted"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p id={`${id}-password-error`} className="mt-1.5 text-sm text-destructive">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <button type="submit" disabled={busy} className={`${adminPrimaryButtonClass} w-full`}>
        {busy ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign in to Admin'
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Authorized personnel only. There is no public registration. Password resets are handled
        by the site administrator on the server.
      </p>
    </form>
  )
}
