'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import analytics from '@/lib/analytics'

export default function AnalyticsInitializer() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize analytics
    analytics.initialize()
  }, [])

  useEffect(() => {
    // Track page views
    if (pathname) {
      analytics.trackPageView(pathname, document.title)
    }
  }, [pathname])

  return null
}
