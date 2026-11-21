'use client'

import { useId, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { interestOptions } from '@/lib/site'
import { cn } from '@/lib/utils'

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'interest' | 'message', string>>

const inputClass =
  'mt-2 block w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-base outline-none transition-all placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 aria-invalid:border-destructive'

function validate(data: FormData): Errors {
  const errors: Errors = {}
  const get = (k: string) => String(data.get(k) ?? '').trim()
  if (!get('name')) errors.name = 'Please enter your name.'
  const email = get('email')
  if (!email) errors.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.'
  const phone = get('phone')
  if (phone && !/^[+\d][\d\s-]{6,}$/.test(phone)) errors.phone = 'Please enter a valid phone number.'
  if (!get('interest')) errors.interest = 'Please choose an area of interest.'
  if (!get('message')) errors.message = 'Please tell us a little about your project.'
  return errors
}

export function ContactForm() {
  const id = useId()
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const next = validate(new FormData(form))
    setErrors(next)
    const firstInvalid = Object.keys(next)[0]
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      setSubmitted(false)
      return
    }
    setSubmitted(true)
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const field = (name: keyof Errors) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
  })

  const ErrorText = ({ name }: { name: keyof Errors }) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-sm text-destructive">
        {errors[name]}
      </p>
    ) : null

  const Label = ({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) => (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  )

  return (
    <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <div>
        <Label htmlFor={`${id}-name`} required>
          Full name
        </Label>
        <input {...field('name')} type="text" autoComplete="name" placeholder="Your name" className={inputClass} />
        <ErrorText name="name" />
      </div>
      <div>
        <label htmlFor={`${id}-org`} className="text-sm font-semibold text-foreground">
          Organization
        </label>
        <input id={`${id}-org`} name="organization" type="text" autoComplete="organization" placeholder="Company or institution" className={inputClass} />
      </div>
      <div>
        <Label htmlFor={`${id}-email`} required>
          Email
        </Label>
        <input {...field('email')} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" className={inputClass} />
        <ErrorText name="email" />
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className="text-sm font-semibold text-foreground">
          Phone
        </label>
        <input {...field('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="Phone number" className={inputClass} />
        <ErrorText name="phone" />
      </div>
      <div>
        <Label htmlFor={`${id}-interest`} required>
          Area of interest
        </Label>
        <select {...field('interest')} defaultValue="" className={cn(inputClass, 'appearance-auto')}>
          <option value="" disabled>
            Select an option
          </option>
          {interestOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ErrorText name="interest" />
      </div>
      <div>
        <label htmlFor={`${id}-location`} className="text-sm font-semibold text-foreground">
          Project location
        </label>
        <input
          id={`${id}-location`}
          name="location"
          type="text"
          autoComplete="address-level2"
          placeholder="City, state"
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor={`${id}-message`} required>
          Project details
        </Label>
        <textarea
          {...field('message')}
          rows={6}
          placeholder="Tell us about your site, requirements, and any timelines you have in mind."
          className={inputClass}
        />
        <ErrorText name="message" />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_rgba(20,83,45,0.55)] transition-all hover:-translate-y-0.5 hover:bg-primary/92 sm:self-start"
        >
          Send Enquiry
        </button>
        <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
          {submitted && (
            <div className="flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm leading-relaxed">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
              <p>
                <strong>Your details look good, but this enquiry was not sent.</strong> The form is not yet
                connected to an inbox. Once SAMAR’s approved contact details or form backend are configured,
                enquiries will be delivered.
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
