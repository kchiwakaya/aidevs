'use server'

import { supabase } from './supabase'
import type { Poll, PollOption, CreatePollData, PollWithOptions } from '@/types/database'
import { redirect } from 'next/navigation'

export async function getPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        votes
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching polls:', error)
    throw error
  }

  return data
}

export async function getPoll(id: string) {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        votes
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching poll:', error)
    throw error
  }

  return data
}

export async function getPollByShareCode(shareCode: string) {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        votes
      )
    `)
    .eq('share_code', shareCode)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching poll by share code:', error)
    throw error
  }

  return data
}

export async function createPoll(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const allowMultipleVotes = formData.get('allowMultipleVotes') === 'on'
  const expiresAt = formData.get('expiresAt') as string
  
  // Get all options from the form
  const options: string[] = []
  let optionIndex = 0
  while (formData.get(`option-${optionIndex}`)) {
    const option = formData.get(`option-${optionIndex}`) as string
    if (option.trim()) {
      options.push(option.trim())
    }
    optionIndex++
  }

  // Validate required fields
  if (!title?.trim()) {
    throw new Error('Poll title is required')
  }
  
  if (options.length < 2) {
    throw new Error('At least 2 options are required')
  }

  // Create the poll
  const pollData: Partial<Poll> = {
    title: title.trim(),
    description: description?.trim() || null,
    allow_multiple_votes: allowMultipleVotes,
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    is_active: true,
    user_id: null // For now, we'll support anonymous poll creation
  }

  const { data: newPoll, error: pollError } = await supabase
    .from('polls')
    .insert([pollData])
    .select()
    .single()

  if (pollError) {
    console.error('Error creating poll:', pollError)
    throw new Error('Failed to create poll')
  }

  // Create poll options
  const pollOptions = options.map(option => ({
    poll_id: newPoll.id,
    text: option,
    votes: 0
  }))

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(pollOptions)

  if (optionsError) {
    console.error('Error creating poll options:', optionsError)
    throw new Error('Failed to create poll options')
  }

  // Redirect to the new poll
  redirect(`/polls/${newPoll.id}`)
}

export async function voteOnPoll(pollId: string, optionId: string, userId?: string, voterIp?: string) {
  const { error } = await supabase
    .from('votes')
    .insert([{
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
      voter_ip: voterIp
    }])

  if (error) {
    console.error('Error voting:', error)
    throw error
  }

  // Vote count is automatically updated by database trigger
}
