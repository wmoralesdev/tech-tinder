"use client"

import { useEffect } from "react"
import { useAuth } from "@clerk/tanstack-react-start"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

export function CurrentUserSync() {
  const { isSignedIn } = useAuth()
  const storeCurrentUser = useMutation(api.users.storeCurrentUser)

  useEffect(() => {
    if (isSignedIn) {
      void storeCurrentUser()
    }
  }, [isSignedIn, storeCurrentUser])

  return null
}
