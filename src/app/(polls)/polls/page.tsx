import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPolls } from "@/lib/polls"

export default async function PollsListPage() {
  const polls = await getPolls()

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Polls</h1>
          <p className="text-sm text-muted-foreground">Browse and vote on community polls.</p>
        </div>
        <Link href="/polls/new">
          <Button>New poll</Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {polls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No polls yet.</p>
              <Link href="/polls/new">
                <Button className="mt-4">Create the first poll</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          polls.map((poll) => {
            const totalVotes = poll.poll_options?.reduce((sum, option) => sum + option.votes, 0) || 0
            const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
            
            return (
              <Card key={poll.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href={`/polls/${poll.id}`} className="hover:underline">
                      {poll.title}
                    </Link>
                  </CardTitle>
                  {poll.description && (
                    <CardDescription>{poll.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span>{totalVotes} votes</span>
                      <span>{poll.poll_options?.length || 0} options</span>
                      {poll.allow_multiple_votes && <span>Multiple votes</span>}
                      {isExpired && <span className="text-red-600">Expired</span>}
                    </div>
                    <span>
                      {new Date(poll.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}


