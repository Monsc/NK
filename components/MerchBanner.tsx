import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function MerchBanner() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          New Merchandise
        </Badge>
        <h2 className="text-3xl font-bold mb-4">
          Support the Cause with Style
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Show your support for a democratic UK with our exclusive merchandise.
          All proceeds go towards our advocacy work.
        </p>
        <div className="space-x-4">
          <Button asChild variant="secondary" size="lg">
            <Link href="/merch">Shop Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/support">Donate</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
