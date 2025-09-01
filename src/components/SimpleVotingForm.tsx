'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { voteOnPoll } from '@/lib/polls'
import type { PollWithOptions } from '@/types/database'

type SimpleVotingFormProps = {
  poll: PollWithOptions
}

export default function SimpleVotingForm({ poll }: SimpleVotingFormProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate total votes for results display
  const totalVotes = poll.poll_options.reduce((sum, option) => sum + option.votes, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOption) {
      setError('Please select an option')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Check if this is a mock poll (for testing)
      const isMockPoll = window.location.pathname.includes('/mock/')
      
      if (isMockPoll) {
        // Simulate API delay for mock polls
        await new Promise(resolve => setTimeout(resolve, 1000))
        setHasVoted(true)
      } else {
        // Real voting for actual polls
        await voteOnPoll(poll.id, selectedOption)
        setHasVoted(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
      setIsSubmitting(false)
    }
  }

  // Thank you state after voting
  if (hasVoted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg">Your vote has been recorded successfully.</p>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Current Results:</h3>
            {poll.poll_options.map((option) => {
              const votes = option.votes + (selectedOption === option.id ? 1 : 0) // Optimistic update
              const percentage = totalVotes > 0 ? (votes / (totalVotes + 1)) * 100 : 0
              
              return (
                <div key={option.id} className="text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className={selectedOption === option.id ? 'font-bold text-blue-600' : ''}>
                      {option.text}
                    </span>
                    <span className="text-sm text-gray-600">
                      {votes} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        selectedOption === option.id ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Total votes: {totalVotes + 1}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Voting form
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        {poll.description && (
          <p className="text-gray-600">{poll.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-gray-700 mb-3">
              Choose your option:
            </legend>
            
            {poll.poll_options.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="poll-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="flex-1 text-sm font-medium">
                  {option.text}
                </span>
                <span className="text-xs text-gray-500">
                  {option.votes} votes
                </span>
              </label>
            ))}
          </fieldset>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !selectedOption}
          >
            {isSubmitting ? 'Submitting Vote...' : 'Submit Vote'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
