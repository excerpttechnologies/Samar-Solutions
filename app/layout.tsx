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
    template: `%s | ${site.name}`,
  },
  description:
    'SAMAR SOLUTIONS INDIA PVT. LTD. delivers end-to-end solar rooftop solutions, EV charging infrastructure, and renewable-energy EPC services across India. Established 2013.',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'Powering a Sustainable Future with Smarter Solar Solutions',
    description:
      'End-to-end renewable energy and EV infrastructure solutions—from site assessment and design to installation, commissioning, and maintenance.',
    images: [
      {
        url: '/images/projects/02-elevated-commercial-solar-array.webp',
        width: 1671,
        height: 941,
        alt: 'Solar panel installation by SAMAR SOLUTIONS INDIA PVT. LTD.',
      },
    ],
    locale: 'en_IN',
  },
  icons: {
    icon: [
      { url: '/brand/samar-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/brand/samar-icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/brand/samar-apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#062d24',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.legalName,
  logo: '/brand/samar-logo.png',
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
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${manrope.variable} ${jakarta.variable}`}
    >
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
