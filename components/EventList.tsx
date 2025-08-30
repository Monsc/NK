'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  type: 'meeting' | 'protest' | 'conference' | 'workshop'
  attendees: number
  maxAttendees?: number
  isOnline: boolean
  registrationUrl?: string
}

export function EventList() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'online'>('all')

  const events: Event[] = [
    {
      id: '1',
      title: 'Democratic Reform Discussion - London',
      date: '2024-02-15',
      time: '19:00',
      location: 'Conway Hall, Red Lion Square',
      description: 'Join us for an in-depth discussion about constitutional reform and the future of UK democracy. Guest speakers include constitutional experts and political activists.',
      type: 'meeting',
      attendees: 45,
      maxAttendees: 100,
      isOnline: false,
      registrationUrl: '/events/london-meeting'
    },
    {
      id: '2',
      title: 'March for Democratic Principles',
      date: '2024-03-01',
      time: '12:00',
      location: 'Manchester City Centre',
      description: 'A peaceful march advocating for constitutional reform and democratic principles. Join hundreds of supporters as we call for change.',
      type: 'protest',
      attendees: 230,
      maxAttendees: 500,
      isOnline: false,
      registrationUrl: '/events/manchester-march'
    },
    {
      id: '3',
      title: 'Virtual Town Hall: Future of UK Democracy',
      date: '2024-02-28',
      time: '20:00',
      location: 'Online (Zoom)',
      description: 'An online discussion featuring experts, activists, and citizens. Explore pathways to democratic reform and constitutional change.',
      type: 'conference',
      attendees: 120,
      maxAttendees: 300,
      isOnline: true,
      registrationUrl: '/events/virtual-townhall'
    },
    {
      id: '4',
      title: 'Advocacy Skills Workshop',
      date: '2024-03-10',
      time: '14:00',
      location: 'Birmingham Community Centre',
      description: 'Learn effective advocacy techniques, how to contact your MP, and organize local campaigns. Perfect for new activists.',
      type: 'workshop',
      attendees: 25,
      maxAttendees: 50,
      isOnline: false,
      registrationUrl: '/events/advocacy-workshop'
    }
  ]

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'protest': return 'bg-red-100 text-red-800'
      case 'conference': return 'bg-purple-100 text-purple-800'
      case 'workshop': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return new Date(event.date) > new Date()
    if (filter === 'online') return event.isOnline
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Events
        </Button>
        <Button 
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button 
          variant={filter === 'online' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('online')}
        >
          Online Only
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg leading-tight">
                  {event.title}
                </CardTitle>
                <Badge className={getEventTypeColor(event.type)}>
                  {event.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date and Time */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)} at {event.time}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
                {event.isOnline && (
                  <Badge variant="secondary" className="text-xs">
                    Online
                  </Badge>
                )}
              </div>

              {/* Attendees */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {event.attendees} attending
                  {event.maxAttendees && ` / ${event.maxAttendees} max`}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed">
                {event.description}
              </p>

              {/* Action Button */}
              {event.registrationUrl && (
                <Button asChild className="w-full">
                  <a href={event.registrationUrl}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Register Now
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Check back later for upcoming events or try a different filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
