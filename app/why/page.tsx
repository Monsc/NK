import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SectionCard } from '@/components/SectionCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DataVisualization from '@/components/DataVisualization'
import { Timeline } from '@/components/Timeline'
import { Callout } from '@/components/Callout'
import Link from 'next/link'
import { 
  Scale, 
  Coins, 
  Users, 
  Globe, 
  Award,
  BookOpen,
  Heart,
  Shield
} from 'lucide-react'

export default function WhyPage() {
  const timelineEvents = [
    {
      year: 1688,
      title: 'Glorious Revolution',
      description: 'Established constitutional monarchy but maintained hereditary privilege.',
      category: 'constitutional' as const
    },
    {
      year: 1832,
      title: 'Reform Act',
      description: 'Extended voting rights but maintained aristocratic influence.',
      category: 'political' as const
    },
    {
      year: 1918,
      title: 'Universal Suffrage',
      description: 'All men and some women gained voting rights.',
      category: 'social' as const
    },
    {
      year: 2024,
      title: 'Modern Democracy',
      description: 'Most democracies elect their heads of state.',
      category: 'constitutional' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Abolish the Monarchy
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Why Abolish the Monarchy?</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The British monarchy is an outdated institution that costs taxpayers millions whilst serving no real purpose. Here&apos;s why it should be abolished.
          </p>
        </div>

        {/* Key Arguments */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Key Arguments Against the Monarchy</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SectionCard
              title="Hereditary Privilege"
              description="The monarchy represents an outdated system of inherited privilege and power."
              href="/why/hereditary-privilege"
              icon={<Scale className="h-6 w-6" />}
              badge="Core"
            />
            <SectionCard
              title="Cost to Taxpayers"
              description="The monarchy costs UK taxpayers over £100 million annually."
              href="/why/cost-to-taxpayers"
              icon={<Coins className="h-6 w-6" />}
              badge="Financial"
            />
            <SectionCard
              title="Lack of Accountability"
              description="The royal family is not accountable to the British people."
              href="/why/accountability"
              icon={<Users className="h-6 w-6" />}
              badge="Political"
            />
            <SectionCard
              title="Royal Scandals"
              description="Ongoing scandals and controversies within the royal family."
              href="/why/royal-scandals"
              icon={<Globe className="h-6 w-6" />}
              badge="Scandal"
            />
            <SectionCard
              title="Outdated Institution"
              description="The monarchy is an archaic institution unfit for modern Britain."
              href="/why/accountability"
              icon={<Shield className="h-6 w-6" />}
              badge="Governance"
            />
            <SectionCard
              title="Public Opinion"
              description="Growing public support for abolishing the monarchy."
              href="/why/public-opinion"
              icon={<Award className="h-6 w-6" />}
              badge="Support"
            />
          </div>
        </section>

        {/* Cost Analysis */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">The Cost of the Monarchy to Taxpayers</h2>
          <div className="max-w-4xl mx-auto">
            <DataVisualization 
              title="Annual Cost Breakdown"
              data={[
                { name: 'Sovereign Grant', value: 86.3 },
                { name: 'Security Costs', value: 100 },
                { name: 'Property Maintenance', value: 50 },
                { name: 'Travel & Expenses', value: 20 }
              ]}
              type="pie"
            />
          </div>
        </section>

        {/* Detailed Arguments */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Detailed Analysis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <CardTitle>Hereditary Privilege</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The monarchy represents an outdated system where power and privilege are inherited rather than earned. 
                  This contradicts modern British values of equality and meritocracy.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Power based on birth, not ability</li>
                  <li>• Privileged access to wealth and influence</li>
                  <li>• No democratic accountability</li>
                  <li>• Contradicts modern British values</li>
                </ul>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/why/hereditary-privilege">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <CardTitle>Cost to Taxpayers</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The hereditary system costs UK taxpayers millions of pounds annually. 
                  This money could be better spent on public services, education, healthcare, or returned to taxpayers.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sovereign Grant: £86.3 million annually</li>
                  <li>• Security costs: £100+ million annually</li>
                  <li>• Property maintenance: £50+ million annually</li>
                  <li>• Travel and official expenses: £20+ million annually</li>
                </ul>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/why/cost-to-taxpayers">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Historical Context */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">The Monarchy&apos;s Historical Burden</h2>
          <div className="max-w-4xl mx-auto">
            <Timeline events={timelineEvents} />
          </div>
        </section>

        {/* International Comparison */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Countries Without Monarchies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Republics (Elected Heads of State)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Germany</span>
                    <Badge variant="secondary">Federal President</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Ireland</span>
                    <Badge variant="secondary">President</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>France</span>
                    <Badge variant="secondary">President</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Italy</span>
                    <Badge variant="secondary">President</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>United States</span>
                    <Badge variant="secondary">President</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Constitutional Monarchies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>UK</span>
                    <Badge variant="outline">Hereditary</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Netherlands</span>
                    <Badge variant="outline">Hereditary</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Belgium</span>
                    <Badge variant="outline">Hereditary</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sweden</span>
                    <Badge variant="outline">Hereditary</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Norway</span>
                    <Badge variant="outline">Hereditary</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <Callout type="info">
            <h3 className="text-xl font-semibold mb-2">Ready to Learn More?</h3>
            <p className="mb-4">
              Explore our detailed articles on democratic principles, costs, and the path to reform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <a href="/learn">Start Learning</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/act">Take Action</a>
              </Button>
            </div>
          </Callout>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What would replace the monarchy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A democratically elected head of state, similar to Ireland or Germany. 
                  This could be a President with ceremonial duties or a more executive role, 
                  decided through democratic processes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Would this require a referendum?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Constitutional reform of this magnitude would likely require a referendum, 
                  giving the people a direct say in the future of their democracy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What about tourism and tradition?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Historical sites and traditions can be preserved without hereditary privilege. 
                  Many republics maintain rich cultural traditions and attract significant tourism.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How long would this process take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Constitutional reform is a significant undertaking that would require careful planning, 
                  public consultation, and democratic processes. The timeline would depend on public support and political will.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
