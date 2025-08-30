import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function CallToAction() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            The Time for Change is Now
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            The monarchy has betrayed the trust of the British people. 
            Support our work to abolish this obstacle to true democracy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white border-2 border-red-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Support This Work</h3>
              <p className="text-slate-600 mb-6">
                Your contribution funds our Action Fund, supporting grassroots projects 
                that advance the cause of abolition through education and activism.
              </p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-red-600 mb-2">1,000 USDT</div>
                <div className="text-sm text-slate-500">Monthly Operational Target</div>
              </div>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full" asChild>
                <Link href="/support">Donate Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-red-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Apply for Grants</h3>
              <p className="text-slate-600 mb-6">
                We provide funding for community projects that promote democratic values 
                and work towards abolishing hereditary privilege.
              </p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-red-600 mb-2">50-500 USDT</div>
                <div className="text-sm text-slate-500">Project Funding Range</div>
              </div>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full" asChild>
                <Link href="/grants">Apply Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 mb-6">
            Join thousands of supporters working towards a democratic future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900" asChild>
              <Link href="/community">Join Community</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900" asChild>
              <Link href="/learn">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
