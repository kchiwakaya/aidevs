"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from "@/lib/auth";
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      window.location.href = '/polls';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user.user_metadata?.name || user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">Sign in</Button>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


