import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Calendar, FileText, Video } from 'lucide-react'

export default function EducationPage() {
  const resources = [
    {
      title: "Constitutional Reform Guide",
      description: "Comprehensive guide to understanding constitutional reform and democratic principles.",
      type: "PDF",
      icon: <FileText className="h-6 w-6" />,
      downloadUrl: "/resources/constitutional-reform-guide.pdf"
    },
    {
      title: "Democratic Principles Video Series",
      description: "Educational videos explaining democratic principles and their importance.",
      type: "Video",
      icon: <Video className="h-6 w-6" />,
      downloadUrl: "/resources/democratic-principles-videos"
    },
    {
      title: "Interactive Timeline",
      description: "Explore the history of democratic reform in the UK through an interactive timeline.",
      type: "Interactive",
      icon: <Calendar className="h-6 w-6" />,
      downloadUrl: "/timeline"
    }
  ]

  const events = [
    {
      title: "Introduction to Democratic Reform",
      date: "2024-02-20",
      time: "19:00",
      location: "Online",
      attendees: 45,
      maxAttendees: 100
    },
    {
      title: "Constitutional Law Workshop",
      date: "2024-02-25",
      time: "14:00",
      location: "London",
      attendees: 23,
      maxAttendees: 50
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
              Educational Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Education</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn about democratic principles, constitutional reform, and the importance of 
              building a modern, representative democracy in the UK.
            </p>
          </div>

          {/* Resources Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Educational Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {resource.icon}
                      <CardTitle>{resource.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{resource.description}</p>
                    <Button asChild>
                      <a href={resource.downloadUrl}>Access Resource</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Upcoming Educational Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{event.date} at {event.time}</span>
                      <span>{event.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {event.attendees} attending / {event.maxAttendees} max
                      </span>
                    </div>
                    <Button asChild>
                      <a href={`/events/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        Register for Event
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-12">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-8">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Ready to Learn More?</h3>
                  <p className="mb-6 max-w-2xl mx-auto">
                    Join our educational programs and become an informed advocate for democratic reform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" asChild>
                      <a href="/register">Join Our Programs</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/resources">Browse All Resources</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
