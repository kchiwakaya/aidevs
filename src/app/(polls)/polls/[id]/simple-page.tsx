import { notFound } from "next/navigation"
import { getPoll } from "@/lib/polls"
import SimpleVotingForm from "@/components/SimpleVotingForm"

type SimplePollPageProps = {
  params: { id: string }
}

export default async function SimplePollPage({ params }: SimplePollPageProps) {
  const { id } = params

  if (!id) return notFound()

  try {
    const poll = await getPoll(id)
    
    if (!poll) {
      return notFound()
    }

    // Check if poll is expired
    const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Poll Details</h1>
            <p className="text-gray-600">Cast your vote below</p>
          </div>

          {isExpired ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-red-800 font-semibold mb-2">Poll Expired</h2>
                <p className="text-red-600 text-sm">
                  This poll expired on {new Date(poll.expires_at!).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <SimpleVotingForm poll={poll} />
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Created: {new Date(poll.created_at).toLocaleDateString()}</p>
            {poll.expires_at && (
              <p>Expires: {new Date(poll.expires_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading poll:', error)
    return notFound()
  }
}
