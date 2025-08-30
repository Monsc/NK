import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { InteractiveTimeline } from '@/components/InteractiveTimeline'
import { SectionCard } from '@/components/SectionCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Callout } from '@/components/Callout'
import { 
  BookOpen, 
  History, 
  Users, 
  Globe, 
  Target, 
  Award,
  FileText,
  Video,
  Podcast,
  Download,
  Shield
} from 'lucide-react'

export default function LearnPage() {
  const resources = [
    {
      title: "Arguments Against Monarchy",
      description: "Core arguments for abolishing the British monarchy.",
      href: "/learn/arguments",
      icon: <BookOpen className="h-6 w-6" />,
      badge: "Foundation"
    },
    {
      title: "Historical Context",
      description: "The evolution of the monarchy and its historical burden.",
      href: "/learn/history",
      icon: <History className="h-6 w-6" />,
      badge: "Background"
    },
    {
      title: "International Examples",
      description: "How other countries function without monarchies.",
      href: "/learn/international",
      icon: <Globe className="h-6 w-6" />,
      badge: "Comparative"
    },
    {
      title: "Abolition Process",
      description: "Understanding the path to abolishing the monarchy.",
      href: "/learn/abolition",
      icon: <Target className="h-6 w-6" />,
      badge: "Process"
    }
  ]

  const learningMaterials = [
    {
      title: "Anti-Monarchy Guide",
      type: "PDF",
      description: "Comprehensive guide to abolishing the monarchy in the UK.",
      icon: <FileText className="h-5 w-5" />,
      href: "/resources/anti-monarchy-guide.pdf"
    },
    {
      title: "Monarchy History",
      type: "Video",
      description: "Video series on the evolution of the British monarchy.",
      icon: <Video className="h-5 w-5" />,
      href: "/resources/monarchy-history"
    },
    {
      title: "International Comparisons",
      type: "Podcast",
      description: "Podcast exploring countries without monarchies.",
      icon: <Podcast className="h-5 w-5" />,
      href: "/resources/international-comparisons"
    },
    {
      title: "Abolition Toolkit",
      type: "PDF",
      description: "Practical toolkit for anti-monarchy advocacy.",
      icon: <Download className="h-5 w-5" />,
      href: "/resources/abolition-toolkit.pdf"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Educational Resources
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Learn</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the history and arguments against the monarchy. Understand why the British monarchy 
            should be abolished and how this would benefit the UK.
          </p>
        </div>

        {/* Learning Topics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Learning Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <SectionCard
                key={resource.title}
                title={resource.title}
                description={resource.description}
                href={resource.href}
                icon={resource.icon}
                badge={resource.badge}
              />
            ))}
          </div>
        </section>

                 {/* Interactive Timeline */}
         <section className="mb-12">
           <h2 className="text-3xl font-bold text-center mb-8">Monarchy&apos;s Historical Burden</h2>
           <div className="max-w-6xl mx-auto">
             <InteractiveTimeline />
           </div>
         </section>

        {/* Learning Materials */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Learning Materials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {learningMaterials.map((material) => (
              <Card key={material.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {material.icon}
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{material.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{material.description}</p>
                  <Button variant="outline" asChild>
                    <a href={material.href}>Access Resource</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

                 {/* Key Concepts */}
         <section className="mb-12">
           <h2 className="text-3xl font-bold text-center mb-8">Key Arguments Against Monarchy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <CardTitle>Popular Sovereignty</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The principle that the authority of government is derived from the consent of the governed. 
                  In a democracy, power flows from the people to their representatives.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Government by consent of the governed</li>
                  <li>• Regular free and fair elections</li>
                  <li>• Universal suffrage and participation</li>
                  <li>• Accountability to the electorate</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <CardTitle>Meritocracy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  A system where leadership and advancement are based on ability, talent, and achievement 
                  rather than birthright or privilege.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Leadership based on ability and choice</li>
                  <li>• Equal opportunity for advancement</li>
                  <li>• Recognition of merit and achievement</li>
                  <li>• Democratic selection processes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <CardTitle>Accountability</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The principle that those in power are answerable to the people for their actions 
                  and can be removed through democratic processes.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Transparency in government actions</li>
                  <li>• Regular elections and term limits</li>
                  <li>• Public scrutiny and oversight</li>
                  <li>• Mechanisms for removal from office</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <CardTitle>Representation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The principle that government should reflect and represent the diversity 
                  and interests of the entire population.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Diverse representation in government</li>
                  <li>• Inclusive decision-making processes</li>
                  <li>• Protection of minority rights</li>
                  <li>• Equal voice for all citizens</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What is constitutional reform?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Constitutional reform involves changing the fundamental rules and structures of government. 
                  This can include changing how leaders are selected, the distribution of powers, 
                  or the rights and responsibilities of citizens.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do other democracies work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most modern democracies elect their heads of state through democratic processes. 
                  Examples include Ireland, Germany, France, and the United States, 
                  where presidents are chosen by the people or their representatives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What are the benefits of democratic reform?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Democratic reform can lead to greater accountability, representation, 
                  and legitimacy in government. It can also reduce costs and ensure 
                  leadership is based on merit rather than birthright.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How can I learn more?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore our educational resources, attend events, join discussions, 
                  and engage with our community. We provide comprehensive materials 
                  to help you understand democratic reform.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <Callout type="info">
            <h3 className="text-xl font-semibold mb-2">Ready to Take Action?</h3>
            <p className="mb-4">
              Now that you&apos;ve learned about democratic reform, consider how you can contribute to the movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <a href="/act">Take Action</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/community">Join Community</a>
              </Button>
            </div>
          </Callout>
        </section>
      </main>
      <Footer />
    </div>
  )
}
