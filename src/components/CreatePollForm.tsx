'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPoll } from '@/lib/polls'

export default function CreatePollForm() {
  const [options, setOptions] = useState(['', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addOption = () => {
    if (options.length < 10) { // Limit to 10 options
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) { // Keep at least 2 options
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Add all options to form data
      options.forEach((option, index) => {
        formData.append(`option-${index}`, option)
      })

      await createPoll(formData)
      // Redirect happens in the server action
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
          <CardDescription>
            Create a poll and share it with others using a unique link or QR code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Poll Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="What's your favorite programming language?"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add some context to help voters understand your poll..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <Label>Poll Options *</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    disabled={isSubmitting}
                    required={index < 2} // First two options are required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={isSubmitting}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              {options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  disabled={isSubmitting}
                >
                  Add Option
                </Button>
              )}
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium">Poll Settings</h3>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowMultipleVotes"
                  name="allowMultipleVotes"
                  className="rounded border-gray-300"
                  disabled={isSubmitting}
                />
                <Label htmlFor="allowMultipleVotes" className="text-sm">
                  Allow multiple votes per person
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date (optional)</Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="datetime-local"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Leave empty for polls that never expire
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
