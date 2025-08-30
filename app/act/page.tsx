import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EventList } from '@/components/EventList'
import ClientPoll from '@/components/ClientPoll'
import { Survey } from '@/components/Survey'
import { DonateButtons } from '@/components/DonateButtons'
import { SectionCard } from '@/components/SectionCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Megaphone, Calendar, Users, Heart, FileText, Mail } from 'lucide-react'

export default function ActPage() {
  const pollData = {
    question: "What's your preferred approach to abolishing the monarchy?",
    options: [
      { id: '1', text: 'Immediate abolition', votes: 45 },
      { id: '2', text: 'Gradual transition', votes: 32 },
      { id: '3', text: 'Referendum first', votes: 23 }
    ],
    totalVotes: 100
  }

  const surveyQuestions = [
    {
      id: '1',
      question: 'What issues are most important to you regarding abolishing the monarchy?',
      type: 'text' as const
    },
    {
      id: '2',
      question: 'How would you rate the current monarchy system?',
      type: 'rating' as const
    },
    {
      id: '3',
      question: 'What actions would you be willing to take?',
      type: 'multiple-choice' as const,
      options: ['Sign petitions', 'Attend protests', 'Contact MPs', 'Donate', 'Volunteer']
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Take Action</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the campaign to abolish the British monarchy. Every action counts towards ending hereditary privilege.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <SectionCard
            title="Sign Petitions"
            description="Support ongoing campaigns to abolish the monarchy."
            href="/petitions"
            icon={<FileText className="h-6 w-6" />}
            badge="Active"
          />
          <SectionCard
            title="Attend Events"
            description="Join local meetings and demonstrations."
            href="/events"
            icon={<Calendar className="h-6 w-6" />}
            badge="Upcoming"
          />
          <SectionCard
            title="Contact MPs"
            description="Write to your representatives about abolishing the monarchy."
            href="/contact-mps"
            icon={<Mail className="h-6 w-6" />}
            badge="Important"
          />
          <SectionCard
            title="Join Community"
            description="Connect with local anti-monarchy groups."
            href="/community"
            icon={<Users className="h-6 w-6" />}
            badge="Growing"
          />
          <SectionCard
            title="Spread Awareness"
            description="Share information about abolishing the monarchy."
            href="/share"
            icon={<Megaphone className="h-6 w-6" />}
            badge="Viral"
          />
          <SectionCard
            title="Support Financially"
            description="Help fund our campaign to abolish the monarchy."
            href="/support"
            icon={<Heart className="h-6 w-6" />}
            badge="Critical"
          />
        </div>

        {/* Stats Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Our Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">12,543</div>
                <div className="text-muted-foreground">Petition Signatures</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">47</div>
                <div className="text-muted-foreground">Events Organized</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">892</div>
                <div className="text-muted-foreground">MPs Contacted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">28,450 USDT</div>
                <div className="text-muted-foreground">Funds Raised</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          <EventList />
        </section>

        {/* Poll Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Community Poll</h2>
          <ClientPoll 
            id="support-method"
            question={pollData.question}
            options={pollData.options}
            totalVotes={pollData.totalVotes}
          />
        </section>

        {/* Survey Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Share Your Views</h2>
                     <Survey
             title="Anti-Monarchy Survey"
             description="Help us understand your priorities and preferences for abolishing the monarchy in the UK."
             questions={surveyQuestions}
           />
        </section>

        {/* Donation Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Support Our Work</h2>
                     <p className="text-muted-foreground mb-6">
             Your financial support helps us continue our campaign work, organize events, and advocate for abolishing the monarchy.
           </p>
          <DonateButtons />
        </section>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="pt-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
                         <p className="text-muted-foreground mb-6">
               Join our campaign today and help abolish the monarchy for future generations.
             </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/community">Join Community</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/support">Donate Now</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
