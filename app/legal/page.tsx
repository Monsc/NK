import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Legal</h1>
        <div className="prose max-w-none">
          <h2>Terms of Service</h2>
          <p>This website advocates for democratic reform in the UK.</p>
          
          <h2>Privacy Policy</h2>
          <p>We respect your privacy and protect your personal data.</p>
          
          <h2>Disclaimer</h2>
          <p>All content is for educational and advocacy purposes.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
