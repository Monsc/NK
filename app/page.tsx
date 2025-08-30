import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { StatGrid } from '@/components/StatGrid'
import { Features } from '@/components/Features'
import { CallToAction } from '@/components/CallToAction'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <StatGrid />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
