import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import AnalyticsInitializer from '@/components/AnalyticsInitializer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NoKing - For a Democratic UK',
    template: '%s | NoKing'
  },
  description: 'Advocating for a democratic UK without hereditary privilege. Join the movement for constitutional reform and democratic principles.',
  keywords: ['democracy', 'republic', 'constitutional reform', 'UK politics', 'democratic principles', 'anti-monarchy'],
  authors: [{ name: 'NoKing Team' }],
  creator: 'NoKing',
  publisher: 'NoKing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://noking.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://noking.org',
    title: 'NoKing - For a Democratic UK',
    description: 'Advocating for a democratic UK without hereditary privilege.',
    siteName: 'NoKing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NoKing - Democratic UK Advocacy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoKing - For a Democratic UK',
    description: 'Advocating for a democratic UK without hereditary privilege.',
    images: ['/og-image.jpg'],
    creator: '@noking',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  // PWA metadata
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'theme-color': '#dc2626',
    'msapplication-TileColor': '#dc2626',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'NoKing',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning translate="no" data-no-translate="true" className={`${inter.variable} notranslate`}>
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <AnalyticsInitializer />
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
