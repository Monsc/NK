import { Badge } from '@/components/ui/badge'
import { CheckCircle, Bot } from 'lucide-react'

interface ReviewBadgeProps {
  type: 'ai-assisted' | 'human-reviewed'
  reviewer?: string
  reviewedAt?: number
  className?: string
}

export function ReviewBadge({ type, reviewer, reviewedAt, className }: ReviewBadgeProps) {
  if (type === 'ai-assisted') {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
        <Bot className="h-3 w-3" />
        AI-assisted
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="default" className={`flex items-center gap-1 bg-green-600 hover:bg-green-700 ${className}`}>
        <CheckCircle className="h-3 w-3" />
        Human-reviewed
      </Badge>
      {reviewer && (
        <span className="text-xs text-gray-500">
          by {reviewer}
          {reviewedAt && (
            <span className="ml-1">
              • {new Date(reviewedAt).toLocaleDateString()}
            </span>
          )}
        </span>
      )}
    </div>
  )
}
