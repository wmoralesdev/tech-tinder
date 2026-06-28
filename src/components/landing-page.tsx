"use client"

import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { Show } from "@clerk/tanstack-react-start"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  FavouriteIcon,
  SparklesIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { LandingPreviewStack } from "@/components/landing-preview-stack"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { INTENT_OPTIONS } from "@/lib/profile-constants"
import { LANDING_QUOTES } from "@/lib/landing-demo-profiles"

const STEPS = [
  {
    icon: UserIcon,
    title: "Drop a short profile",
    body: "Three photos max. One headline. No LinkedIn scroll.",
  },
  {
    icon: SparklesIcon,
    title: "Swipe with intent",
    body: "Romance, co-founder, pair partner, or rubber duck club.",
  },
  {
    icon: FavouriteIcon,
    title: "Match and ship",
    body: "Mutual likes unlock matches. Go build something weird.",
  },
] as const

export function LandingPage() {
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % LANDING_QUOTES.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_oklch(0.92_0.04_330)_0%,_var(--background)_45%)] dark:bg-[radial-gradient(circle_at_top,_oklch(0.28_0.05_330)_0%,_var(--background)_50%)]">
      <main className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-background/90 shadow-xl ring-1 ring-border/60 backdrop-blur-sm dark:bg-background/80">
        <div className="flex flex-1 flex-col px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
          <motion.header
            className="space-y-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                meme-ish but useful
              </Badge>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                PWA beta
              </p>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-[2.65rem] font-bold leading-[0.95] tracking-tight">
                Tech
                <span className="block text-primary">Tinder</span>
              </h1>
              <p className="max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
                Tinder energy for builders. Short profiles, real matches, less
                networking theater.
              </p>
            </div>
          </motion.header>

          <section className="mt-6">
            <LandingPreviewStack />
          </section>

          <motion.section
            className="mt-5 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            {INTENT_OPTIONS.map((intent) => (
              <Badge
                key={intent.value}
                variant="outline"
                className="rounded-full border-border/80 bg-background/70 px-2.5 py-1 text-[11px]"
              >
                {intent.label}
              </Badge>
            ))}
          </motion.section>

          <section className="mt-5 min-h-[4.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                className="rounded-2xl border border-border/70 bg-muted/45 px-4 py-3 text-sm leading-relaxed text-foreground/90"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {LANDING_QUOTES[quoteIndex]}
              </motion.p>
            </AnimatePresence>
          </section>

          <section className="mt-6 space-y-3">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex gap-3 rounded-2xl border border-border/60 bg-card/70 px-3.5 py-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.08, duration: 0.3 }}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={step.icon} strokeWidth={2} className="size-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </section>
        </div>

        <footer className="sticky bottom-0 space-y-2 border-t border-border/70 bg-background/95 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <Show when="signed-out">
            <Button
              render={<Link to="/sign-up" />}
              nativeButton={false}
              className="h-12 w-full text-base"
              size="lg"
            >
              Start swiping
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
            </Button>
            <Button
              variant="outline"
              render={<Link to="/sign-in" />}
              nativeButton={false}
              className="h-11 w-full"
              size="lg"
            >
              I already ship here
            </Button>
          </Show>
          <Show when="signed-in">
            <Button
              render={<Link to="/discover" />}
              nativeButton={false}
              className="h-12 w-full text-base"
              size="lg"
            >
              Open discover
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
            </Button>
          </Show>
        </footer>
      </main>
    </div>
  )
}
