"use client"

import { ProfileForm } from "@/components/profile-form"
import { ProtectedPage } from "@/components/protected-page"

export function ProfilePage() {
  return (
    <ProtectedPage requireProfile={false}>
      <ProfileForm />
    </ProtectedPage>
  )
}
