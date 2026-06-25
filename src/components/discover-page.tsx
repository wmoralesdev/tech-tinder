"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import { api } from "../../convex/_generated/api"
import { MatchDialog } from "@/components/match-dialog"
import { ProtectedPage } from "@/components/protected-page"
import {
  SwipeCard,
  SwipeCardExit,
  type DiscoveryProfile,
} from "@/components/swipe-card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { SparklesIcon } from "@hugeicons/core-free-icons"

export function DiscoverPage() {
  return (
    <ProtectedPage>
      <DiscoverFeed />
    </ProtectedPage>
  )
}

function DiscoverFeed() {
  const candidates = useQuery(api.profiles.getDiscoveryCandidates, { limit: 20 })
  const swipe = useMutation(api.swipes.swipe)

  const [deck, setDeck] = useState<DiscoveryProfile[]>([])
  const [busy, setBusy] = useState(false)
  const [exiting, setExiting] = useState<{
    profile: DiscoveryProfile
    direction: "like" | "pass"
  } | null>(null)
  const [matchOpen, setMatchOpen] = useState(false)
  const [matchProfile, setMatchProfile] = useState<DiscoveryProfile | null>(null)

  useEffect(() => {
    if (candidates) {
      setDeck((previous) =>
        previous.length === 0 ? (candidates as DiscoveryProfile[]) : previous,
      )
    }
  }, [candidates])

  const current = deck[0]

  const handleSwipe = async (direction: "like" | "pass") => {
    if (!current || busy || exiting) return

    setBusy(true)
    setExiting({ profile: current, direction })

    try {
      const result = await swipe({
        profileId: current.profileId,
        direction,
      })

      if (result.matched) {
        setMatchProfile(current)
        setMatchOpen(true)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Swipe failed")
      setExiting(null)
      setBusy(false)
    }
  }

  const handleExitDone = () => {
    setDeck((previous) => previous.slice(1))
    setExiting(null)
    setBusy(false)
  }

  if (candidates === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header>
        <h1 className="font-heading text-xl font-semibold">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Swipe right to ship it. Left to pass (politely).
        </p>
      </header>

      <div className="relative flex flex-1 flex-col justify-center py-2">
        {current && !exiting ? (
          <SwipeCard profile={current} onSwipe={handleSwipe} disabled={busy} />
        ) : null}

        {exiting ? (
          <SwipeCardExit
            profile={exiting.profile}
            direction={exiting.direction}
            onDone={handleExitDone}
          />
        ) : null}

        {!current && !exiting ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>Deck cleared</EmptyTitle>
              <EmptyDescription>
                No candidates right now. Touch grass, push code, check back later.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
      </div>

      <MatchDialog
        open={matchOpen}
        profile={matchProfile}
        onOpenChange={setMatchOpen}
        onKeepSwiping={() => {
          setMatchOpen(false)
          setMatchProfile(null)
        }}
      />
    </div>
  )
}
