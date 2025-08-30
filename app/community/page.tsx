import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Callout } from '@/components/Callout'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { 
  Users, 
  MapPin, 
  MessageCircle, 
  Calendar, 
  Heart,
  Shield,
  Award,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react'

export default function CommunityPage() {
  const localGroups = [
    {
      name: "London Democratic Reform",
      location: "London, England",
      members: 1247,
      description: "Active group organizing events and campaigns in the capital.",
      contact: "london@noking.org",
      nextEvent: "2024-02-15"
    },
    {
      name: "Manchester Republic",
      location: "Manchester, England",
      members: 892,
      description: "Growing community advocating for democratic reform in the North West.",
      contact: "manchester@noking.org",
      nextEvent: "2024-02-20"
    },
    {
      name: "Edinburgh Democracy",
      location: "Edinburgh, Scotland",
      members: 654,
      description: "Scottish advocates for constitutional reform and democratic principles.",
      contact: "edinburgh@noking.org",
      nextEvent: "2024-02-18"
    },
    {
      name: "Cardiff Reform",
      location: "Cardiff, Wales",
      members: 456,
      description: "Welsh community working towards democratic reform and representation.",
      contact: "cardiff@noking.org",
      nextEvent: "2024-02-22"
    }
  ]

  const onlineForums = [
    {
      name: "General Discussion",
      description: "Open forum for discussing democratic reform and related topics.",
      members: 3420,
      topics: 1247,
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      name: "Event Planning",
      description: "Coordinate local events, protests, and community activities.",
      members: 1890,
      topics: 567,
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Policy Discussion",
      description: "In-depth discussions about constitutional reform and policy proposals.",
      members: 2156,
      topics: 892,
      icon: <Shield className="h-5 w-5" />
    },
    {
      name: "New Members",
      description: "Welcome area for new community members and introductions.",
      members: 4567,
      topics: 234,
      icon: <Users className="h-5 w-5" />
    }
  ]

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Join Our Community
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Community</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our community of advocates for a democratic UK. Connect with like-minded individuals, 
              participate in discussions, and take action together.
            </p>
          </div>

          {/* Community Stats */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">15,420+</div>
                  <div className="text-muted-foreground">Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">47</div>
                  <div className="text-muted-foreground">Local Groups</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">892</div>
                  <div className="text-muted-foreground">Events Organized</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">12,543</div>
                  <div className="text-muted-foreground">Forum Posts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Groups */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Local Groups</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {localGroups.map((group) => (
                <Card key={group.name} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {group.name}
                        </CardTitle>
                        <p className="text-muted-foreground">{group.location}</p>
                      </div>
                      <Badge variant="secondary">{group.members} members</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{group.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Next event: {group.nextEvent}</span>
                      <span>Contact: {group.contact}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" asChild>
                        <a href={`mailto:${group.contact}`}>Contact</a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/groups/${group.name.toLowerCase().replace(/\s+/g, '-')}`}>View Group</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Start Your Own Group */}
          <section className="mb-12">
            <Card>
              <CardContent className="pt-8">
                <div className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Start Your Own Local Group</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Can&apos;t find a group in your area? Start your own! We provide resources, 
                    support, and guidance to help you build a local community of advocates.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <a href="/start-group">Start a Group</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/resources/group-guide.pdf">Download Guide</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Online Forums */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Online Forums</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {onlineForums.map((forum) => (
                <Card key={forum.name} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {forum.icon}
                      <CardTitle>{forum.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{forum.description}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{forum.members} members</span>
                      <span>{forum.topics} topics</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Community Guidelines */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Community Guidelines</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <CardTitle>Respectful</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Treat all members with respect and dignity. Disagreements are welcome, 
                    but personal attacks are not tolerated.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <CardTitle>Constructive</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Focus on constructive dialogue and positive action. 
                    Share ideas, experiences, and solutions that advance our shared goals.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <CardTitle>Inclusive</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Welcome diverse perspectives and backgrounds. 
                    Our strength comes from our diversity and unity of purpose.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Stay Connected</h2>
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">community@noking.org</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Discord</h3>
                  <p className="text-muted-foreground">Join our Discord server</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+44 20 1234 5678</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-12">
            <Callout type="info">
              <h3 className="text-xl font-semibold mb-2">Ready to Join?</h3>
              <p className="mb-4">
                Become part of our growing community of advocates for democratic reform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <a href="/register">Join Community</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/forums">Browse Forums</a>
                </Button>
              </div>
            </Callout>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
