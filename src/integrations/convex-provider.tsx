"use client"

import { useAuth } from "@clerk/tanstack-react-start"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import type { ConvexReactClient } from "convex/react"

export function ConvexProvider({
  client,
  children,
}: {
  client: ConvexReactClient
  children: React.ReactNode
}) {
  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
