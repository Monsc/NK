interface LatestCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
}

export function LatestCard({ title, excerpt, date }: Omit<LatestCardProps, 'slug'>) {
  return (
    <div className="bg-card p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-2">{date}</p>
      <p className="text-lg mb-4">{excerpt}</p>
    </div>
  )
}
