'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
        <div className="text-green-600 font-medium mb-2">Thank you for voting!</div>
        <p className="text-sm text-muted-foreground">
          Your vote has been recorded. Results are updated in real-time.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {poll.poll_options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
          const isSelected = selectedOptions.includes(option.id)

          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full m-0.5" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{option.text}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{option.votes} votes</div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <p>Total votes: {totalVotes}</p>
          {poll.allow_multiple_votes && (
            <p className="text-xs">Multiple selections allowed</p>
          )}
        </div>
        
        <Button 
          onClick={handleVote}
          disabled={isVoting || selectedOptions.length === 0}
          className="w-full sm:w-auto"
        >
          {isVoting ? 'Submitting...' : 'Submit Vote'}
        </Button>
      </div>
    </div>
  )
}
