import { AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  type?: 'info' | 'warning' | 'success'
  children: React.ReactNode
  className?: string
}

export function Callout({ type = 'info', children, className }: CalloutProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        {
          'status-info': type === 'info',
          'status-warning': type === 'warning',
          'status-success': type === 'success',
        },
        className
      )}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="text-sm">{children}</div>
    </div>
  )
}
