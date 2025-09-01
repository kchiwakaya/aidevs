import { notFound } from "next/navigation"
import SimpleVotingForm from "@/components/SimpleVotingForm"

// Mock poll data for testing
const mockPolls = {
  '1': {
    id: '1',
    title: 'What\'s your favorite programming language?',
    description: 'Choose the programming language you enjoy working with the most.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    user_id: null,
    is_active: true,
    allow_multiple_votes: false,
    expires_at: null,
    share_code: 'ABC12345',
    poll_options: [
      { id: 'opt1', poll_id: '1', text: 'JavaScript', votes: 15, created_at: '2024-01-15T10:00:00Z' },
      { id: 'opt2', poll_id: '1', text: 'Python', votes: 23, created_at: '2024-01-15T10:00:00Z' },
      { id: 'opt3', poll_id: '1', text: 'TypeScript', votes: 18, created_at: '2024-01-15T10:00:00Z' },
      { id: 'opt4', poll_id: '1', text: 'Rust', votes: 7, created_at: '2024-01-15T10:00:00Z' },
    ]
  },
  '2': {
    id: '2',
    title: 'Best time for team meetings?',
    description: 'When should we schedule our weekly team sync?',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T09:00:00Z',
    user_id: null,
    is_active: true,
    allow_multiple_votes: false,
    expires_at: null,
    share_code: 'XYZ67890',
    poll_options: [
      { id: 'opt5', poll_id: '2', text: 'Monday 9 AM', votes: 5, created_at: '2024-01-16T09:00:00Z' },
      { id: 'opt6', poll_id: '2', text: 'Tuesday 2 PM', votes: 12, created_at: '2024-01-16T09:00:00Z' },
      { id: 'opt7', poll_id: '2', text: 'Wednesday 10 AM', votes: 8, created_at: '2024-01-16T09:00:00Z' },
      { id: 'opt8', poll_id: '2', text: 'Friday 3 PM', votes: 3, created_at: '2024-01-16T09:00:00Z' },
    ]
  }
}

type MockPollPageProps = {
  params: { id: string }
}

export default function MockPollPage({ params }: MockPollPageProps) {
  const { id } = params
  const poll = mockPolls[id as keyof typeof mockPolls]

  if (!poll) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Poll Demo</h1>
          <p className="text-gray-600">Testing the voting interface with mock data</p>
        </div>

        <SimpleVotingForm poll={poll} />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🧪 This is a mock poll for testing purposes</p>
          <p>Visit /polls/mock/1 or /polls/mock/2 to try different polls</p>
        </div>
      </div>
    </div>
  )
}
