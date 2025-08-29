export interface Poll {
  id: string
  title: string
  description?: string
  created_at: string
  updated_at: string
  user_id?: string
  is_active: boolean
  allow_multiple_votes: boolean
  expires_at?: string
  share_code: string
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  votes: number
  created_at: string
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  user_id?: string
  voter_ip?: string
  created_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

// Utility types for poll operations
export interface PollWithOptions extends Poll {
  poll_options: PollOption[]
}

export interface PollWithResults extends Poll {
  poll_options: (PollOption & { percentage: number })[]
  total_votes: number
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  allow_multiple_votes?: boolean
  expires_at?: string
}

export interface VoteData {
  poll_id: string
  option_id: string
  user_id?: string
  voter_ip?: string
}
