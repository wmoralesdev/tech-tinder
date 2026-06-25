"use client"

import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, FavouriteIcon } from "@hugeicons/core-free-icons"
import type { Id } from "../../convex/_generated/dataModel"
import { intentLabel, type IntentValue } from "@/lib/profile-constants"
import { getPrimaryImageUrl } from "@/lib/profile-images"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type DiscoveryProfile = {
  profileId: Id<"profiles">
  userId: Id<"users">
  handle: string
  displayName: string
  headline: string
  bio: string
  imageUrls?: string[]
  intents: IntentValue[]
  techTags: string[]
  location?: string
  links?: {
    github?: string
    website?: string
    x?: string
    linkedin?: string
  }
}

const SWIPE_THRESHOLD = 120

export function SwipeCard({
  profile,
  onSwipe,
  disabled = false,
}: {
  profile: DiscoveryProfile
  onSwipe: (direction: "like" | "pass") => void
  disabled?: boolean
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])
  const likeOpacity = useTransform(x, [40, 120], [0, 1])
  const passOpacity = useTransform(x, [-120, -40], [1, 0])
  const imageUrl = getPrimaryImageUrl(profile)

  const finishSwipe = (direction: "like" | "pass") => {
    if (disabled) return
    onSwipe(direction)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return

    if (info.offset.x > SWIPE_THRESHOLD) {
      finishSwipe("like")
      return
    }

    if (info.offset.x < -SWIPE_THRESHOLD) {
      finishSwipe("pass")
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <motion.div
        style={{ x, rotate }}
        drag={disabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className="touch-none"
      >
        <Card className="overflow-hidden shadow-lg">
          <div className="relative aspect-[4/5] bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={profile.displayName}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                No pic — personality diff only
              </div>
            )}

            <motion.div
              style={{ opacity: likeOpacity }}
              className="pointer-events-none absolute top-4 left-4 rotate-[-12deg] rounded-xl border-2 border-emerald-500 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600"
            >
              SHIP IT
            </motion.div>
            <motion.div
              style={{ opacity: passOpacity }}
              className="pointer-events-none absolute top-4 right-4 rotate-[12deg] rounded-xl border-2 border-destructive bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive"
            >
              PASS
            </motion.div>
          </div>

          <CardHeader>
            <CardTitle className="text-lg">
              {profile.displayName}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                @{profile.handle}
              </span>
            </CardTitle>
            <CardDescription>{profile.headline}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">{profile.bio}</p>

            {profile.location ? (
              <p className="text-xs text-muted-foreground">{profile.location}</p>
            ) : null}

            <div className="flex flex-wrap gap-1.5">
              {profile.intents.map((intent) => (
                <Badge key={intent} variant="secondary">
                  {intentLabel(intent)}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.techTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Pass"
          disabled={disabled}
          onClick={() => finishSwipe("pass")}
          className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </Button>
        <Button
          type="button"
          size="icon-lg"
          aria-label="Like"
          disabled={disabled}
          onClick={() => finishSwipe("like")}
          className="rounded-full"
        >
          <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}

export function SwipeCardExit({
  profile,
  direction,
  onDone,
}: {
  profile: DiscoveryProfile
  direction: "like" | "pass"
  onDone: () => void
}) {
  const imageUrl = getPrimaryImageUrl(profile)

  return (
    <motion.div
      initial={{ x: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: direction === "like" ? 500 : -500,
        opacity: 0,
        rotate: direction === "like" ? 15 : -15,
      }}
      transition={{ duration: 0.35, ease: "easeIn" }}
      onAnimationComplete={onDone}
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-full max-w-sm"
    >
      <Card className="overflow-hidden shadow-lg">
        <div className="aspect-[4/5] bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={profile.displayName}
              className="size-full object-cover"
            />
          ) : null}
        </div>
      </Card>
    </motion.div>
  )
}
