import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

type PollDetailsPageProps = {
  params: { id: string };
};

export default function PollDetailsPage({ params }: PollDetailsPageProps) {
  const { id } = params;

  if (!id) return notFound();

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Poll #{id}</CardTitle>
          <CardDescription>Poll details placeholder.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Question: Placeholder question text.</p>
            <div className="flex gap-2">
              <Button variant="secondary">Option A</Button>
              <Button variant="secondary">Option B</Button>
              <Button variant="secondary">Option C</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


