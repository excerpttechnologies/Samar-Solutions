'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastTone = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  tone: ToastTone
  title: string
  description?: string
}

type ToastContextValue = {
  show: (tone: ToastTone, title: string, description?: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const show = useCallback(
    (tone: ToastTone, title: string, description?: string) => {
      const id = nextId++
      setItems((current) => [...current, { id, tone, title, description }])
      window.setTimeout(() => remove(id), 5000)
    },
    [remove],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (title, description) => show('success', title, description),
      error: (title, description) => show('error', title, description),
      info: (title, description) => show('info', title, description),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex flex-col items-end gap-2 sm:left-auto sm:max-w-sm"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full gap-3 rounded-lg border bg-card p-4 shadow-lg animate-in slide-in-from-bottom-2',
              item.tone === 'success' && 'border-primary/25',
              item.tone === 'error' && 'border-destructive/30',
              item.tone === 'info' && 'border-border',
            )}
          >
            {item.tone === 'success' ? (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            ) : item.tone === 'error' ? (
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-destructive"
              />
            ) : (
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="self-start rounded p-1 text-xs text-muted-foreground hover:bg-muted"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used inside ToastProvider')
  return value
}
