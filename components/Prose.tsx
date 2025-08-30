import { cn } from '@/lib/utils'

interface ProseProps {
  children: React.ReactNode
  className?: string
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        'prose prose-gray max-w-none',
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-p:text-muted-foreground prose-p:leading-relaxed',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-muted prose-pre:text-foreground',
        'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-li:text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  )
}
