import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function PollsListPage() {
  const placeholderPolls = [
    { id: "1", title: "Favorite JavaScript framework?", description: "Vote for your top pick." },
    { id: "2", title: "Best dev editor", description: "Choose your daily driver." },
  ];

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Polls</h1>
        <Link href="/polls/new">
          <Button>New poll</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {placeholderPolls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                <Link href={`/polls/${poll.id}`} className="underline">
                  {poll.title}
                </Link>
              </CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Go to poll</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


