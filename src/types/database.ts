export interface Poll {
  id: string
  title: string
  description?: string
  created_at: string
  updated_at: string
  user_id?: string
  is_active: boolean
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
  created_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  created_at: string
}
