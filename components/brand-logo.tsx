import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  tone?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  linked?: boolean
  showName?: boolean
  priority?: boolean
  className?: string
}

const sizes = {
  sm: {
    image: 'h-8',
    name: 'text-[0.7rem] tracking-[0.2em]',
    suffix: 'text-[0.5rem] tracking-[0.24em]',
    gap: 'gap-2.5',
  },
  md: {
    image: 'h-10 md:h-11',
    name: 'text-[0.78rem] tracking-[0.19em] md:text-[0.84rem]',
    suffix: 'text-[0.55rem] tracking-[0.24em] md:text-[0.58rem]',
    gap: 'gap-3',
  },
  lg: {
    image: 'h-14',
    name: 'text-base tracking-[0.17em]',
    suffix: 'text-[0.62rem] tracking-[0.24em]',
    gap: 'gap-4',
  },
}

export function BrandLogo({
  tone = 'light',
  size = 'md',
  linked = true,
  showName = true,
  priority = false,
  className,
}: BrandLogoProps) {
  const light = tone === 'light'
  const styles = sizes[size]

  const content = (
    <>
      <Image
        src="/brand/samar-logo.png"
        alt=""
        width={396}
        height={263}
        priority={priority}
        className={cn(
          'w-auto shrink-0 object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.28)]',
          styles.image,
        )}
      />
      {showName && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              'whitespace-nowrap font-heading font-extrabold',
              styles.name,
              light ? 'text-white' : 'text-foreground',
            )}
          >
            SAMAR SOLUTIONS
          </span>
          <span
            className={cn(
              'mt-1.5 whitespace-nowrap font-semibold uppercase',
              styles.suffix,
              light ? 'text-white/65' : 'text-muted-foreground',
            )}
          >
            INDIA PVT. LTD.
          </span>
        </span>
      )}
    </>
  )

  const classes = cn(
    'group inline-flex min-w-0 items-center rounded-sm',
    styles.gap,
    linked && 'transition-opacity hover:opacity-90',
    className,
  )

  if (!linked) {
    return (
      <div className={classes} aria-label="SAMAR SOLUTIONS INDIA PVT. LTD.">
        {content}
      </div>
    )
  }

  return (
    <Link
      href="/"
      className={classes}
      aria-label="SAMAR SOLUTIONS INDIA PVT. LTD. — home"
    >
      {content}
    </Link>
  )
}
