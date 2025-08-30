interface TimelineEvent {
  year: number
  title: string
  description: string
  category: 'constitutional' | 'social' | 'economic' | 'political'
}

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const sortedEvents = [...events].sort((a, b) => a.year - b.year)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'constitutional':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'social':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'economic':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'political':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-8">
        {sortedEvents.map((event, index) => (
          <div key={index} className="relative flex items-start">
            {/* Timeline dot */}
            <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background" />
            
            {/* Content */}
            <div className="ml-16 flex-1">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {event.year}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
