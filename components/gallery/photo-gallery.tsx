'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import {
  galleryCategories,
  galleryPhotos,
  type GalleryCategorySlug,
  type GalleryPhoto,
} from '@/lib/gallery'
import { cn } from '@/lib/utils'

type Filter = 'all' | GalleryCategorySlug

const categoryLabels = new Map(galleryCategories.map((category) => [category.slug, category.label]))

function categoryCount(slug: GalleryCategorySlug): number {
  return galleryPhotos.filter((photo) => photo.category === slug).length
}

export function PhotoGallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const [activeId, setActiveId] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const swipeStartRef = useRef<number | null>(null)

  const filteredPhotos = useMemo(
    () => (filter === 'all' ? galleryPhotos : galleryPhotos.filter((photo) => photo.category === filter)),
    [filter],
  )

  const activeIndex = activeId === null ? -1 : filteredPhotos.findIndex((photo) => photo.id === activeId)
  const activePhoto = activeIndex >= 0 ? filteredPhotos[activeIndex] : null
  const isOpen = activePhoto !== null

  const openPhoto = (photo: GalleryPhoto) => {
    lastTriggerRef.current = document.activeElement as HTMLElement | null
    setActiveId(photo.id)
  }

  const step = useCallback(
    (direction: 1 | -1) => {
      if (activeIndex < 0) return
      const nextIndex = (activeIndex + direction + filteredPhotos.length) % filteredPhotos.length
      setActiveId(filteredPhotos[nextIndex].id)
    },
    [activeIndex, filteredPhotos],
  )

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      lastTriggerRef.current?.focus?.()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveId(null)
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, step])

  const chooseFilter = (nextFilter: Filter) => {
    setFilter(nextFilter)
    setActiveId(null)
  }

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photographs by category">
          <button
            type="button"
            onClick={() => chooseFilter('all')}
            aria-pressed={filter === 'all'}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300',
              filter === 'all'
                ? 'border-[#f4c65e] bg-[#f4c65e] text-[#1b1408] shadow-[0_12px_30px_-14px_rgba(244,198,94,0.6)]'
                : 'border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10 hover:text-white',
            )}
          >
            All Photos
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                filter === 'all' ? 'bg-[#1b1408]/10' : 'bg-white/10 text-white/70',
              )}
            >
              {galleryPhotos.length}
            </span>
          </button>
          {galleryCategories.map((category) => {
            const selected = filter === category.slug
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => chooseFilter(category.slug)}
                aria-pressed={selected}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300',
                  selected
                    ? 'border-[#a6e65a] bg-[#a6e65a] text-[#0b2a20] shadow-[0_12px_30px_-14px_rgba(166,230,90,0.5)]'
                    : 'border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10 hover:text-white',
                )}
              >
                {category.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                    selected ? 'bg-[#0b2a20]/10' : 'bg-white/10 text-white/70',
                  )}
                >
                  {categoryCount(category.slug)}
                </span>
              </button>
            )
          })}
        </div>
        <p className="shrink-0 text-sm text-white/55" aria-live="polite">
          Showing <span className="font-semibold text-white/85">{filteredPhotos.length}</span> of{' '}
          {galleryPhotos.length} photographs
        </p>
      </div>

      <ul key={filter} className="mt-9 grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPhotos.map((photo) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => openPhoto(photo)}
              className="group relative block w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 text-left shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_30px_70px_-35px_rgba(0,0,0,0.85)]"
              aria-label={`Open larger view: ${photo.caption}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={photo.thumbnail}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#03120e]/85 via-[#03120e]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                  {categoryLabels.get(photo.category)}
                </span>
                <span className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                  <Expand aria-hidden="true" className="size-4" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <p className="translate-y-1 text-sm font-semibold leading-snug text-white transition-transform duration-300 group-hover:translate-y-0 md:text-[15px]">
                    {photo.caption}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#f4c65e] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View full photograph
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {isOpen && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activePhoto.caption} — enlarged photograph`}
          className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-[#03120e]/95 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setActiveId(null)}
          onTouchStart={(event) => {
            swipeStartRef.current = event.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(event) => {
            if (swipeStartRef.current === null) return
            const delta = (event.changedTouches[0]?.clientX ?? swipeStartRef.current) - swipeStartRef.current
            if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1)
            swipeStartRef.current = null
          }}
        >
          <div
            className="relative flex max-h-[96dvh] w-full max-w-6xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-3 text-white">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6e65a]">
                  {categoryLabels.get(activePhoto.category)}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white/90">{activePhoto.caption}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs font-medium tabular-nums text-white/55">
                  {activeIndex + 1} / {filteredPhotos.length}
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Close photograph viewer"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/30">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                sizes="100vw"
                className="h-auto max-h-[70dvh] w-auto max-w-full object-contain sm:max-h-[72dvh]"
              />

              {filteredPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
                    aria-label="Previous photograph"
                  >
                    <ChevronLeft aria-hidden="true" className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
                    aria-label="Next photograph"
                  >
                    <ChevronRight aria-hidden="true" className="size-6" />
                  </button>
                </>
              )}
            </div>

            <p className="pt-3 text-center text-xs leading-relaxed text-white/50 sm:text-left">
              {activePhoto.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
