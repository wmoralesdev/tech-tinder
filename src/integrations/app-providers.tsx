"use client"

import { ThemeProvider } from "next-themes"
import type { ConvexReactClient } from "convex/react"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "./auth-provider"
import { ConvexProvider } from "./convex-provider"
import { CurrentUserSync } from "./current-user-sync"

export function AppProviders({
  convexClient,
  children,
}: {
  convexClient: ConvexReactClient
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ConvexProvider client={convexClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CurrentUserSync />
          {children}
          <Toaster richColors closeButton position="top-center" />
        </ThemeProvider>
      </ConvexProvider>
    </AuthProvider>
  )
}
