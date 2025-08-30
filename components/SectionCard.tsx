import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SectionCardProps {
  title: string
  description: string
  href: string
  badge?: string
  icon?: React.ReactNode
}

export function SectionCard({ title, description, href, badge, icon }: SectionCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full card-hover group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {icon && <span className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
