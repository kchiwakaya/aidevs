'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { voteOnPoll } from '@/lib/polls'
import type { PollWithOptions } from '@/types/database'

type PollVotingProps = {
  poll: PollWithOptions
}

export default function PollVoting({ poll }: PollVotingProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate total votes
  const totalVotes = poll.poll_options.reduce((sum, option) => sum + option.votes, 0)

  const handleOptionSelect = (optionId: string) => {
    if (poll.allow_multiple_votes) {
      // Toggle option for multiple vote polls
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      // Single selection for single vote polls
      setSelectedOptions([optionId])
    }
  }

  const handleVote = async () => {
    if (selectedOptions.length === 0) {
      setError('Please select at least one option')
      return
    }

    setIsVoting(true)
    setError(null)

    try {
      // For multiple votes, submit each selection separately
      for (const optionId of selectedOptions) {
        await voteOnPoll(poll.id, optionId)
      }
      
      setHasVoted(true)
      // Refresh the page to show updated results
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
      setIsVoting(false)
    }
  }

  if (hasVoted) {
    return (
      <div className="text-center py-8">
        <p className="text-green-600 font-medium">Thank you for voting!</p>
        <p className="text-sm text-muted-foreground mt-2">
          Your vote has been recorded. Results are updated in real-time.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {poll.poll_options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
          const isSelected = selectedOptions.includes(option.id)

          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{option.votes} votes</div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-muted-foreground">
          Total votes: {totalVotes}
          {poll.allow_multiple_votes && ' • Multiple selections allowed'}
        </p>
        
        <Button 
          onClick={handleVote}
          disabled={isVoting || selectedOptions.length === 0}
        >
          {isVoting ? 'Submitting...' : 'Submit Vote'}
        </Button>
      </div>
    </div>
  )
}
