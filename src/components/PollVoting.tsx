'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { voteOnPoll } from '@/lib/polls'
import type { PollWithOptions } from '@/types/database'

type PollVotingProps = {
  poll: PollWithOptions
}

// Memoized option component to prevent unnecessary re-renders
const PollOption = memo(({ 
  option, 
  isSelected, 
  percentage, 
  onSelect 
}: {
  option: { id: string; text: string; votes: number }
  isSelected: boolean
  percentage: number
  onSelect: (id: string) => void
}) => (
  <Card
    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
    }`}
    onClick={() => onSelect(option.id)}
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
))

PollOption.displayName = 'PollOption'

function PollVoting({ poll }: PollVotingProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatedPoll, setUpdatedPoll] = useState<PollWithOptions | null>(null)

  // Use the updated poll data if available, otherwise use the original poll
  const currentPoll = updatedPoll || poll

  // Memoize expensive calculations
  const { totalVotes, optionPercentages } = useMemo(() => {
    const total = currentPoll.poll_options.reduce((sum, option) => sum + option.votes, 0)
    const percentages = currentPoll.poll_options.map(option => ({
      id: option.id,
      percentage: total > 0 ? (option.votes / total) * 100 : 0
    }))
    return { totalVotes: total, optionPercentages: percentages }
  }, [currentPoll.poll_options])

  // Memoize event handlers to prevent unnecessary re-renders
  const handleOptionSelect = useCallback((optionId: string) => {
    if (currentPoll.allow_multiple_votes) {
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
  }, [currentPoll.allow_multiple_votes])

  const handleVote = useCallback(async () => {
    if (selectedOptions.length === 0) {
      setError('Please select at least one option')
      return
    }

    setIsVoting(true)
    setError(null)

    try {
      // Batch all vote submissions
      const votePromises = selectedOptions.map(optionId => 
        voteOnPoll(currentPoll.id, optionId)
      )
      
      await Promise.all(votePromises)
      
      // Update poll data locally instead of reloading the page
      const updatedOptions = currentPoll.poll_options.map(option => {
        if (selectedOptions.includes(option.id)) {
          return { ...option, votes: option.votes + 1 }
        }
        return option
      })
      
      setUpdatedPoll({
        ...currentPoll,
        poll_options: updatedOptions
      })
      
      setHasVoted(true)
      setIsVoting(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
      setIsVoting(false)
    }
  }, [selectedOptions, currentPoll])

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
        {currentPoll.poll_options.map((option) => {
          const percentage = optionPercentages.find(p => p.id === option.id)?.percentage || 0
          const isSelected = selectedOptions.includes(option.id)

          return (
            <PollOption
              key={option.id}
              option={option}
              isSelected={isSelected}
              percentage={percentage}
              onSelect={handleOptionSelect}
            />
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <p>Total votes: {totalVotes}</p>
          {currentPoll.allow_multiple_votes && (
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

// Memoize the main component to prevent unnecessary re-renders when props haven't changed
export default memo(PollVoting)
