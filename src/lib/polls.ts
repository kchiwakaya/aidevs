import { supabase } from './supabase'
import type { Poll, PollOption } from '@/types/database'

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

export async function createPoll(poll: Omit<Poll, 'id' | 'created_at' | 'updated_at'>, options: string[]) {
  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .insert([poll])
    .select()
    .single()

  if (pollError) {
    console.error('Error creating poll:', pollError)
    throw pollError
  }

  const pollOptions = options.map(option => ({
    poll_id: pollData.id,
    text: option,
    votes: 0
  }))

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(pollOptions)

  if (optionsError) {
    console.error('Error creating poll options:', optionsError)
    throw optionsError
  }

  return pollData
}

export async function voteOnPoll(pollId: string, optionId: string, userId?: string) {
  const { error } = await supabase
    .from('votes')
    .insert([{
      poll_id: pollId,
      option_id: optionId,
      user_id: userId
    }])

  if (error) {
    console.error('Error voting:', error)
    throw error
  }

  // Update the vote count for the option
  const { error: updateError } = await supabase
    .from('poll_options')
    .update({ votes: supabase.rpc('increment_votes') })
    .eq('id', optionId)

  if (updateError) {
    console.error('Error updating vote count:', updateError)
    throw updateError
  }
}
