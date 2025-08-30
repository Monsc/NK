'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Vote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PollOption {
  id: string
  text: string
  votes: number
}

interface PollProps {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  userVote?: string
  onVote: (optionId: string) => void
  className?: string
}

export default function Poll({
  id,
  question,
  options,
  totalVotes,
  userVote,
  onVote,
  className
}: PollProps) {
  const [localVote, setLocalVote] = useState<string | undefined>(userVote)
  const [localVotes, setLocalVotes] = useState<PollOption[]>(options)

  const handleVote = (optionId: string) => {
    if (localVote) return // Already voted

    setLocalVote(optionId)
    setLocalVotes(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    )
    onVote(optionId)
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Poll
        </CardTitle>
        <p className="text-lg font-medium">{question}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {localVotes.map((option) => {
          const percentage = getPercentage(option.votes)
          const isVoted = localVote === option.id
          
          return (
            <div key={option.id} className="space-y-2">
              <Button
                variant={isVoted ? "default" : "outline"}
                className={cn(
                  "w-full justify-between h-auto p-3",
                  isVoted && "bg-green-600 hover:bg-green-700"
                )}
                onClick={() => handleVote(option.id)}
                disabled={!!localVote}
              >
                <span className="text-left">{option.text}</span>
                {isVoted && <CheckCircle className="h-4 w-4" />}
              </Button>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{option.votes} votes</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
        <div className="pt-2 text-sm text-gray-500 text-center">
          Total votes: {totalVotes}
        </div>
      </CardContent>
    </Card>
  )
}
