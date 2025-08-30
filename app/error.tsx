'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Callout } from '@/components/Callout'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Callout type="warning">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="mb-4">
            We&apos;re sorry, but something unexpected happened. Please try again.
          </p>
          <div className="space-x-4">
            <Button onClick={reset}>
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </Callout>
      </div>
    </div>
  )
}
