'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  adminDangerButtonClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from './form-styles'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  busy?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    confirmRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, busy, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={() => !busy && onClose()}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95"
      >
        <div className="flex gap-4">
          {destructive && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle aria-hidden="true" className="size-5" />
            </span>
          )}
          <div>
            <h2 id="confirm-dialog-title" className="text-lg font-bold">
              {title}
            </h2>
            {description && (
              <p
                id="confirm-dialog-description"
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className={adminSecondaryButtonClass}
            onClick={onClose}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={destructive ? adminDangerButtonClass : adminPrimaryButtonClass}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
