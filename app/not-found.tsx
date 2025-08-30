import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Callout } from '@/components/Callout'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md text-center">
        <Callout type="info">
          <h2 className="text-4xl font-bold mb-4">404</h2>
          <h3 className="text-2xl font-semibold mb-4">Page Not Found</h3>
          <p className="mb-6">
            The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </Callout>
      </div>
    </div>
  )
}
