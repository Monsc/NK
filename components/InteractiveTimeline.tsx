export function InteractiveTimeline() {
  const timeline = [
    {
      year: 1215,
      title: 'Magna Carta',
      description: 'First step towards constitutional limits on royal power.'
    },
    {
      year: 1688,
      title: 'Glorious Revolution',
      description: 'Establishment of constitutional monarchy.'
    },
    {
      year: 1832,
      title: 'Reform Act',
      description: 'Expansion of voting rights and democratic representation.'
    },
    {
      year: 1918,
      title: 'Representation of the People Act',
      description: 'Universal suffrage for men and some women.'
    }
  ]

  return (
    <div className="space-y-6">
      {timeline.map((event, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {event.year}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
