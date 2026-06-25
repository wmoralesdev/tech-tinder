"use client"

import type { ReactNode } from "react"
import { useAuth } from "@clerk/tanstack-react-start"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { AppShell } from "@/components/app-shell"
import { ProfileRequiredCard } from "@/components/profile-required-card"
import { SignedOutCard } from "@/components/signed-out-card"
import { Spinner } from "@/components/ui/spinner"

export function ProtectedPage({
  children,
  requireProfile = true,
  showNav = true,
}: {
  children: ReactNode
  requireProfile?: boolean
  showNav?: boolean
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const profile = useQuery(
    api.profiles.getMine,
    isSignedIn ? {} : "skip",
  )

  const loadingProfile = isSignedIn && profile === undefined

  return (
    <AppShell showNav={showNav && isSignedIn}>
      <main className="flex flex-1 flex-col p-4">
        {!isLoaded || loadingProfile ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : !isSignedIn ? (
          <div className="flex flex-1 items-center justify-center">
            <SignedOutCard />
          </div>
        ) : requireProfile && profile === null ? (
          <div className="flex flex-1 items-center justify-center">
            <ProfileRequiredCard />
          </div>
        ) : (
          children
        )}
      </main>
    </AppShell>
  )
}
