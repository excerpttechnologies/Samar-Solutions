import type { Metadata } from 'next'
import { CtaBand } from '@/components/blocks'
import { PhotoGallery } from '@/components/gallery/photo-gallery'
import { VideoGallery } from '@/components/gallery/video-gallery'
import { PageHero } from '@/components/page-hero'
import { Section } from '@/components/section'

export const metadata: Metadata = {
  title: 'Project Photo Gallery',
  description:
    'Explore solar panel installations, rooftop projects, mounting structures, solar pumps, and site work by SAMAR SOLUTIONS INDIA PVT. LTD. in this 31-photograph project gallery and video collection.',
  openGraph: {
    title: 'Solar Project Photo Gallery | SAMAR SOLUTIONS INDIA PVT. LTD.',
    description:
      'A 31-photograph portfolio of solar installations, rooftop systems, mounting structures, solar pumps, and project site work.',
    images: ['/images/projects/02-elevated-commercial-solar-array.webp'],
  },
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Project Gallery"
        title="Solar installations, engineered and built on site"
        intro="Explore photographs from SAMAR SOLUTIONS INDIA PVT. LTD. solar projects — rooftop arrays, commercial installations, mounting structures, and the site work behind them."
        image="/images/projects/06-metal-roof-solar-sunset.webp"
        imageAlt="Solar panels installed on a blue metal rooftop at sunset"
        imageNote={null}
        cta={false}
      />
      <Section
        id="photo-gallery"
        labelledBy="gallery-title"
        className="bg-[linear-gradient(180deg,#073b70_0%,#0a3565_42%,#0b2a4a_100%)] pt-16 text-white md:pt-20"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="gallery-title" className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Project photography
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              Thirty-one photographs documenting solar panels, rooftops, commercial arrays, mounting
              systems, solar pumps, and installation and grounding work. Select any image for a full-screen view.
            </p>
          </div>
          <p className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f39a32]">
            31 Photographs
          </p>
        </div>

        <div className="mt-10">
          <PhotoGallery />
        </div>

        <div id="videos" className="mt-16 border-t border-white/10 pt-14">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Videos</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Watch our team and completed installations on site. Select play to load and watch a clip.
          </p>
          <VideoGallery />
        </div>
      </Section>
      <CtaBand
        title="Have a rooftop or site ready for solar?"
        body="Share your site details and requirements. Our team can assess the opportunity and outline the right next steps for your solar project."
      />
    </>
  )
}
