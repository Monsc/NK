import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 bg-white">
      <div className="container-responsive">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black">
            A Democratic UK
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Join the movement for a modern, democratic United Kingdom without hereditary privilege. Together, we can build a fairer, more representative society.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg" asChild>
              <Link href="/learn">Learn More</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg" asChild>
              <Link href="/act">Take Action</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
