import Image from 'next/image'
import { CONTACT } from '@/lib/contact'
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
  ctaLabel = `Call ${CONTACT.primary.display}`,
  ctaHref = `tel:${CONTACT.primary.tel}`,
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
    <section className="relative isolate overflow-hidden bg-[#f5f7fa] pt-28 text-foreground md:pt-32 lg:pt-36">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover opacity-30"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/92 to-[#f5f7fa]/70" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(0,82,155,0.10),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(35,155,104,0.10),transparent_38%)]" />
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#f5f7fa] to-[#eef4fb]" />
      )}
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className={image ? 'lg:col-span-7' : 'max-w-4xl lg:col-span-10'}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.02] tracking-tight text-[#073b70] md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              {intro}
            </p>
            {cta && (
              <div className="mt-10 flex flex-wrap gap-3">
                <CtaLink href={ctaHref} variant="primary" arrow>
                  {ctaLabel}
                </CtaLink>
              </div>
            )}
          </div>
          {image && (
            <figure className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#00529b]/10 bg-white shadow-xl">
                <Image
                  src={image}
                  alt={imageAlt ?? ''}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#073b70]/20 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-3 text-xs text-muted-foreground">
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

