import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images } from 'lucide-react'
import { CtaLink } from '@/components/cta-link'
import { Section, SectionHeading } from '@/components/section'
import { galleryCategories, galleryPhotos } from '@/lib/gallery'

const featuredIds = [5, 1, 18, 14, 28, 21]

const categoryLabels = new Map(galleryCategories.map((category) => [category.slug, category.label]))

export function HomeGallery() {
  const featured = featuredIds
    .map((id) => galleryPhotos.find((photo) => photo.id === id))
    .filter((photo): photo is (typeof galleryPhotos)[number] => Boolean(photo))

  return (
    <Section
      id="gallery-preview"
      labelledBy="home-gallery-title"
      tone="ink"
      className="overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(166,230,90,0.14),transparent_38%),radial-gradient(ellipse_at_bottom_left,rgba(244,198,94,0.12),transparent_35%)]"
      />
      <div className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f4c65e]">
              <span aria-hidden="true" className="h-px w-10 bg-[#f4c65e]/70" />
              Project Photo Gallery
            </p>
            <SectionHeading
              id="home-gallery-title"
              title="Our work, captured on site"
              intro="A closer look at the solar installations, rooftop systems, mounting structures, and site work delivered by our team."
              tone="ink"
              className="mt-5"
            />
          </div>
          <CtaLink href="/gallery" variant="accent" arrow className="shrink-0 self-start md:self-auto">
            View Full Gallery
          </CtaLink>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((photo) => (
            <li key={photo.id}>
              <Link
                href="/gallery"
                className="group relative block overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 text-left shadow-[0_24px_60px_-40px_rgba(0,0,0,0.85)] transition-all duration-500 hover:-translate-y-1 hover:border-white/25"
                aria-label={`View the full project gallery, including ${photo.caption.toLowerCase()}`}
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
                    className="absolute inset-0 bg-gradient-to-t from-[#03120e]/85 via-[#03120e]/10 to-transparent"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                    {categoryLabels.get(photo.category)}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
                    <p className="max-w-[85%] text-sm font-semibold leading-snug text-white md:text-[15px]">
                      {photo.caption}
                    </p>
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/25 text-[#f4c65e] backdrop-blur transition-colors group-hover:bg-[#f4c65e] group-hover:text-[#1b1408]">
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="flex items-center gap-2 text-sm text-white/65">
            <Images aria-hidden="true" className="size-4 text-[#a6e65a]" />
            30 photographs across rooftop, commercial, residential, and site-work categories.
          </p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#f4c65e] transition-colors hover:text-[#ffe7a3]"
          >
            Browse the complete portfolio
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  )
}
