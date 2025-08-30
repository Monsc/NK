'use client'

import Poll from './Poll'

interface ClientPollProps {
  id: string
  question: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
}

export default function ClientPoll(props: ClientPollProps) {
  const handleVote = (optionId: string) => {
    console.log('Voted for:', optionId)
    // Here you would typically make an API call to record the vote
  }

  return (
    <Poll
      {...props}
      onVote={handleVote}
    />
  )
}
