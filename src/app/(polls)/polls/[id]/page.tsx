import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getPoll } from "@/lib/polls"
import PollVoting from "@/components/PollVoting"
import PollShare from "@/components/PollShare"

type PollDetailsPageProps = {
  params: { id: string }
}

export default async function PollDetailsPage({ params }: PollDetailsPageProps) {
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
      <div className="mx-auto max-w-3xl p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription>{poll.description}</CardDescription>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                Created: {new Date(poll.created_at).toLocaleDateString()}
              </span>
              {poll.expires_at && (
                <span className={isExpired ? 'text-red-600' : ''}>
                  Expires: {new Date(poll.expires_at).toLocaleDateString()}
                </span>
              )}
              {poll.allow_multiple_votes && (
                <span>Multiple votes allowed</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isExpired ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-medium">This poll has expired</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Voting is no longer available, but you can view the results.
                </p>
              </div>
            ) : (
              <PollVoting poll={poll} />
            )}
          </CardContent>
        </Card>

        <PollShare poll={poll} />
      </div>
    )
  } catch (error) {
    console.error('Error loading poll:', error)
    return notFound()
  }
}


