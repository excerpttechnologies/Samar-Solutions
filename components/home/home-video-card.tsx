'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, X } from 'lucide-react'
import type { GalleryVideo } from '@/lib/videos'

/**
 * Video tile that matches the photo cards in the home gallery grid. The poster
 * is shown first; selecting it opens a lightbox with native controls. Nothing
 * autoplays until the visitor clicks.
 */
export function HomeVideoCard({
  video,
  categoryLabel,
}: {
  video: GalleryVideo
  categoryLabel: string
}) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 text-left shadow-[0_24px_60px_-40px_rgba(0,0,0,0.85)] transition-all duration-500 hover:-translate-y-1 hover:border-white/25"
        aria-label={`Play video: 40 kW rooftop solar EPC by SAMAR Solutions`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={video.poster}
            alt="Rows of solar panels installed on a commercial rooftop by SAMAR Solutions, with yellow safety railings along the roof edge."
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#061e3a]/85 via-[#061e3a]/10 to-transparent"
          />
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
            {categoryLabel}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#f39a32] text-[#243447] shadow-xl transition-transform duration-300 group-hover:scale-110">
              <Play aria-hidden="true" className="ml-0.5 size-5 fill-current" />
            </span>
          </span>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
            <p className="max-w-[85%] text-sm font-semibold leading-snug text-white md:text-[15px]">
              {video.caption}
            </p>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/25 text-[#f39a32] backdrop-blur transition-colors group-hover:bg-[#f39a32] group-hover:text-[#243447]">
              <ArrowRight aria-hidden="true" className="size-4" />
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-[#061e3a]/95 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex max-h-[92dvh] w-full max-w-4xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-3 text-white">
              <p className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f39a32]">
                {categoryLabel}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close video"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <video
              className="max-h-[80dvh] w-full rounded-[1.25rem] border border-white/10 bg-black"
              src={video.src}
              poster={video.poster}
              width={video.width}
              height={video.height}
              controls
              autoPlay
              playsInline
              preload="metadata"
              aria-label="40 kW rooftop solar EPC installation by SAMAR Solutions"
            >
              Your browser does not support the video element.
            </video>
            <p className="pt-3 text-xs leading-relaxed text-white/60">{video.title}</p>
          </div>
        </div>
      )}
    </li>
  )
}
