"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewPollPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card className="card">
        <CardHeader>
          <CardTitle>Create a new poll</CardTitle>
          <CardDescription>Draft your question and options.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g. Favorite frontend framework?" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Optional context..." rows={4} />
            </div>
            <div className="grid gap-2">
              <Label>Options</Label>
              <div className="grid gap-2">
                <Input placeholder="Option 1" />
                <Input placeholder="Option 2" />
                <Input placeholder="Option 3 (optional)" />
              </div>
            </div>
            <Button type="submit">Create poll</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


