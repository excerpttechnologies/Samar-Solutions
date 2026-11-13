import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { Section } from '@/components/section'
import { getPublishedGalleryImages } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photographs of solar rooftop and EV charging work by SAMAR Solutions India.',
}

export const dynamic = 'force-dynamic'

export default function GalleryPage() {
  const images = getPublishedGalleryImages()

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="On-site views of solar, EV charging, and infrastructure work"
        intro="A visual collection of photographs from published project work by SAMAR Solutions."
        cta={false}
      />
      <Section labelledBy="gallery-title" className="bg-[linear-gradient(180deg,#062d24_0%,#0b3a31_45%,#151c1b_100%)] pt-16 md:pt-20 text-white">
        <h2 id="gallery-title" className="sr-only">
          Photo gallery
        </h2>
        {images.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur md:p-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a6e65a]">Gallery</p>
            <p className="mt-4 font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">Gallery coming soon</p>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/72">
              Project photography will appear here as published projects with gallery images are added.
            </p>
            <Link
              href="/projects"
              className="mt-7 inline-flex text-sm font-semibold text-[#f4c65e] underline-offset-4 hover:underline"
            >
              View our projects
            </Link>
          </div>
        ) : (
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images.map((image, index) => (
              <li key={`${image.url}-${index}`} className="mb-4 break-inside-avoid">
                <figure className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-sm backdrop-blur">
                  <Link href={`/projects/${image.projectSlug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={image.url}
                        alt={image.altText ?? `${image.projectTitle} project photograph`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </Link>
                  <figcaption className="px-4 py-4">
                    <p className="text-sm font-semibold leading-snug text-white">
                      {image.caption ?? image.projectTitle}
                    </p>
                    <p className="mt-1 text-xs text-white/60">{image.projectTitle}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
