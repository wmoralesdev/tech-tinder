"use client"

import { Link } from "@tanstack/react-router"
import { Show } from "@clerk/tanstack-react-start"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function LandingPage() {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_oklch(0.92_0.04_330)_0%,_var(--background)_45%)] dark:bg-[radial-gradient(circle_at_top,_oklch(0.28_0.05_330)_0%,_var(--background)_50%)]">
      <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-between bg-background/90 p-6 shadow-xl ring-1 ring-border/60 backdrop-blur-sm dark:bg-background/80">
        <header className="space-y-4 pt-8">
          <Badge variant="secondary" className="rounded-full">
            meme-ish but useful
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            Tech Tinder
          </h1>
          <p className="text-base text-muted-foreground">
            Swipe short dev profiles for romance, co-founders, project partners,
            and rubber-duck energy.
          </p>
        </header>

        <section className="space-y-3 text-sm">
          <p className="rounded-2xl bg-muted/70 px-4 py-3">
            &ldquo;Looking for someone who reads the diff before approving.&rdquo;
          </p>
          <p className="rounded-2xl bg-muted/70 px-4 py-3">
            &ldquo;Co-founder wanted. Must tolerate my 2am &lsquo;quick fix&rsquo; commits.&rdquo;
          </p>
        </section>

        <footer className="space-y-3 pb-8">
          <Show when="signed-out">
            <Button render={<Link to="/sign-up" />} nativeButton={false} className="w-full" size="lg">
              Get swiping
            </Button>
            <Button
              variant="outline"
              render={<Link to="/sign-in" />}
              nativeButton={false}
              className="w-full"
              size="lg"
            >
              I already have an account
            </Button>
          </Show>
          <Show when="signed-in">
            <Button render={<Link to="/discover" />} nativeButton={false} className="w-full" size="lg">
              Open discover
            </Button>
          </Show>
        </footer>
      </main>
    </div>
  )
}
