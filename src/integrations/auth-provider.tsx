"use client"

import { ClerkProvider } from "@clerk/tanstack-react-start"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (!publishableKey) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY")
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>
}
