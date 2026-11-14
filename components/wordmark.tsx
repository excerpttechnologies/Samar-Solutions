import { BrandLogo } from './brand-logo'

/**
 * Backwards-compatible brand lockup used across the site and admin area.
 * Renders the official SAMAR logo with the full legal company name.
 */
export function Wordmark({
  tone = 'dark',
  className,
}: {
  tone?: 'dark' | 'light'
  className?: string
}) {
  return <BrandLogo tone={tone} size="md" className={className} />
}
