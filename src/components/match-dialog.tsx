"use client"

import { Link } from "@tanstack/react-router"
import { motion } from "framer-motion"
import type { DiscoveryProfile } from "@/components/swipe-card"
import { getPrimaryImageUrl } from "@/lib/profile-images"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function MatchDialog({
  open,
  profile,
  onOpenChange,
  onKeepSwiping,
}: {
  open: boolean
  profile: DiscoveryProfile | null
  onOpenChange: (open: boolean) => void
  onKeepSwiping: () => void
}) {
  const imageUrl = profile ? getPrimaryImageUrl(profile) : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="overflow-hidden">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-xl">It&apos;s a match!</DialogTitle>
            <DialogDescription>
              Reciprocal like detected. No merge conflict here.
            </DialogDescription>
          </DialogHeader>

          {profile ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <Avatar size="lg" className="size-20">
                {imageUrl ? <AvatarImage src={imageUrl} alt={profile.displayName} /> : null}
                <AvatarFallback>
                  {profile.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{profile.displayName}</p>
                <p className="text-sm text-muted-foreground">@{profile.handle}</p>
                <p className="mt-1 text-sm">{profile.headline}</p>
              </div>
            </div>
          ) : null}

          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={onKeepSwiping}>
              Keep swiping
            </Button>
            <Button render={<Link to="/matches" />} nativeButton={false} onClick={() => onOpenChange(false)}>
              View matches
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
