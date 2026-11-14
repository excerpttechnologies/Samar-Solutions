import Image from 'next/image'
import { Eyebrow } from './section'
import { CtaLink } from './cta-link'

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  imageNote,
  cta = true,
  ctaLabel = 'Request a Consultation',
  ctaHref = '/contact',
}: {
  eyebrow: string
  title: string
  intro: string
  image?: string
  imageAlt?: string
  imageNote?: string | null
  cta?: boolean
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#062d24] pt-28 text-ink-foreground md:pt-32 lg:pt-36">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover opacity-40"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062d24] via-[#062d24]/88 to-[#087f83]/35" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(244,198,94,0.18),transparent_38%),radial-gradient(ellipse_at_bottom_right,rgba(166,230,90,0.12),transparent_35%)]" />
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-[#062d24] via-[#087a55] to-[#151c1b]" />
      )}
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className={image ? 'lg:col-span-7' : 'max-w-4xl lg:col-span-10'}>
            <Eyebrow tone="ink">{eyebrow}</Eyebrow>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-foreground/78 md:text-xl">
              {intro}
            </p>
            {cta && (
              <div className="mt-10 flex flex-wrap gap-3">
                <CtaLink href={ctaHref} variant="accent" arrow>
                  {ctaLabel}
                </CtaLink>
                <CtaLink href="/projects" variant="outline-light">
                  View Projects
                </CtaLink>
              </div>
            )}
          </div>
          {image && (
            <figure className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                <Image
                  src={image}
                  alt={imageAlt ?? ''}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-3 text-xs text-ink-foreground/55">
                {imageNote === null
                  ? null
                  : (imageNote ?? 'Representative image, not a SAMAR project.')}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}

