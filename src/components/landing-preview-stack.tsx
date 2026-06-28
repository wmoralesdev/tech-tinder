"use client"

import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import type { LandingDemoProfile } from "@/lib/landing-demo-profiles"
import { LANDING_DEMO_PROFILES } from "@/lib/landing-demo-profiles"
import { intentLabel } from "@/lib/profile-constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ACCENT_STYLES: Record<
  LandingDemoProfile["accent"],
  { ring: string; glow: string; avatar: string }
> = {
  rose: {
    ring: "ring-primary/30",
    glow: "from-primary/20 via-transparent to-transparent",
    avatar: "bg-primary/15 text-primary",
  },
  violet: {
    ring: "ring-chart-3/40",
    glow: "from-chart-3/20 via-transparent to-transparent",
    avatar: "bg-chart-3/15 text-chart-3",
  },
  cyan: {
    ring: "ring-chart-2/40",
    glow: "from-chart-2/20 via-transparent to-transparent",
    avatar: "bg-chart-2/15 text-chart-2",
  },
}

function PreviewCard({
  profile,
  depth,
}: {
  profile: LandingDemoProfile
  depth: number
}) {
  const styles = ACCENT_STYLES[profile.accent]
  const scale = 1 - depth * 0.05
  const yOffset = depth * 14

  return (
    <motion.div
      className="absolute inset-x-0 top-0 mx-auto w-full max-w-[17.5rem]"
      style={{ zIndex: 10 - depth }}
      initial={{ opacity: 0, y: 24 + yOffset, scale: scale - 0.04 }}
      animate={{
        opacity: 1 - depth * 0.12,
        y: yOffset,
        scale,
      }}
      transition={{ delay: 0.15 + depth * 0.08, duration: 0.45 }}
    >
      <motion.div
        animate={
          depth === 0
            ? {
                y: [0, -6, 0],
                rotate: [-1.5, 1.5, -1.5],
              }
            : undefined
        }
        transition={
          depth === 0
            ? { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            : undefined
        }
      >
        <Card
          className={cn(
            "overflow-hidden border-border/70 shadow-lg ring-1 backdrop-blur-sm",
            styles.ring,
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-b",
              styles.glow,
            )}
          />
          <CardHeader className="relative space-y-3 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-2xl font-heading text-sm font-bold",
                    styles.avatar,
                  )}
                >
                  {profile.displayName.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    {profile.displayName}
                  </CardTitle>
                  <p className="truncate text-xs text-muted-foreground">
                    @{profile.handle}
                  </p>
                </div>
              </div>
              <HugeiconsIcon
                icon={SparklesIcon}
                strokeWidth={2}
                className="size-4 shrink-0 text-muted-foreground"
              />
            </div>
            <p className="text-sm leading-snug text-foreground/90">
              {profile.headline}
            </p>
          </CardHeader>
          <CardContent className="relative space-y-3 pb-5">
            <div className="flex flex-wrap gap-1.5">
              {profile.intents.map((intent) => (
                <Badge key={intent} variant="secondary" className="rounded-full text-[10px]">
                  {intentLabel(intent)}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.techTags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export function LandingPreviewStack() {
  return (
    <div className="relative mx-auto h-[15.5rem] w-full max-w-[18rem]">
      {[...LANDING_DEMO_PROFILES].reverse().map((profile, index, array) => (
        <PreviewCard
          key={profile.handle}
          profile={profile}
          depth={array.length - 1 - index}
        />
      ))}

      <motion.div
        className="pointer-events-none absolute -right-1 top-8 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-md"
        initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: 8 }}
        transition={{ delay: 0.55, type: "spring", stiffness: 260, damping: 18 }}
      >
        <span className="inline-flex items-center gap-1">
          <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} className="size-3" />
          SHIP IT
        </span>
      </motion.div>
    </div>
  )
}
