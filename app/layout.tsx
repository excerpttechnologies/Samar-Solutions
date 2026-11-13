import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Solar Rooftop, EV Charging & EPC Services in India`,
    template: `%s | ${site.shortName}`,
  },
  description:
    'SAMAR Solutions India Pvt. Ltd. delivers end-to-end solar rooftop solutions, EV charging infrastructure, and renewable-energy EPC services across India. Established 2013.',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'Clean Energy. Smart Mobility. Sustainable Growth.',
    description:
      'End-to-end renewable energy and EV infrastructure solutions—from site assessment and design to installation, commissioning, and maintenance.',
    images: ['/images/hero-solar-rooftop.png'],
    locale: 'en_IN',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#062d24',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  foundingDate: '2013',
  description:
    'Engineering, Procurement, and Construction (EPC) for solar rooftop systems, EV charging infrastructure, and renewable-energy projects in India.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable} ${jakarta.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
