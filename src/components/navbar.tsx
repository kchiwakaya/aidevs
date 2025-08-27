import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/polls" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded bg-primary" />
          <span className="font-semibold">Pollster</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/polls">
            <Button variant="ghost" className="hidden sm:inline-flex">Dashboard</Button>
          </Link>
          <Link href="/polls/new">
            <Button size="sm">New poll</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}


