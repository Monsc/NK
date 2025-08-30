// Analytics and performance monitoring utilities

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

interface PageViewEvent extends AnalyticsEvent {
  name: 'page_view'
  properties: {
    path: string
    title: string
    referrer?: string
  }
}

interface UserActionEvent extends AnalyticsEvent {
  name: 'user_action'
  properties: {
    action: string
    element?: string
    value?: string
  }
}

interface ErrorEvent extends AnalyticsEvent {
  name: 'error'
  properties: {
    message: string
    stack?: string
    component?: string
  }
}

type AnalyticsEventType = PageViewEvent | UserActionEvent | ErrorEvent

class Analytics {
  private events: AnalyticsEventType[] = []
  private isInitialized = false

  initialize() {
    if (this.isInitialized) return

    // Initialize performance monitoring
    this.initializePerformanceMonitoring()
    
    // Initialize error tracking
    this.initializeErrorTracking()
    
    this.isInitialized = true
    console.log('Analytics initialized')
  }

  private initializePerformanceMonitoring() {
    if (typeof window === 'undefined') return

    // Track page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        this.trackEvent('performance', {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
        })
      }
    })
  }

  private initializeErrorTracking() {
    if (typeof window === 'undefined') return

    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.trackError(event.error?.message || 'Unknown error', event.error?.stack)
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('Unhandled promise rejection', event.reason?.toString())
    })
  }

  trackPageView(path: string, title: string, referrer?: string) {
    const event: PageViewEvent = {
      name: 'page_view',
      properties: {
        path,
        title,
        referrer: referrer || document.referrer
      },
      timestamp: Date.now()
    }
    
    this.events.push(event)
    this.sendToAnalytics(event)
  }

  trackEvent(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now()
    }
    
    this.events.push(event as AnalyticsEventType)
    this.sendToAnalytics(event as AnalyticsEventType)
  }

  trackUserAction(action: string, element?: string, value?: string) {
    const event: UserActionEvent = {
      name: 'user_action',
      properties: {
        action,
        element,
        value
      },
      timestamp: Date.now()
    }
    
    this.events.push(event)
    this.sendToAnalytics(event)
  }

  trackError(message: string, stack?: string, component?: string) {
    const event: ErrorEvent = {
      name: 'error',
      properties: {
        message,
        stack,
        component
      },
      timestamp: Date.now()
    }
    
    this.events.push(event)
    this.sendToAnalytics(event)
  }

  trackSearch(query: string, results: number) {
    this.trackEvent('search', {
      query,
      results,
      timestamp: Date.now()
    })
  }

  trackContentInteraction(type: string, contentId: string, action: string) {
    this.trackEvent('content_interaction', {
      type,
      contentId,
      action,
      timestamp: Date.now()
    })
  }

  private sendToAnalytics(event: AnalyticsEventType) {
    // In a real implementation, this would send to your analytics service
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
    }

    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, event.properties)
    }

    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(console.error)
  }

  getEvents(): AnalyticsEventType[] {
    return [...this.events]
  }

  clearEvents() {
    this.events = []
  }
}

const analytics = new Analytics()

export default analytics
