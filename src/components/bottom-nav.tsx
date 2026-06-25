"use client"

import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FavouriteIcon,
  UserIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

const NAV_ITEMS = [
  { to: "/discover", label: "Discover", icon: SparklesIcon },
  { to: "/matches", label: "Matches", icon: FavouriteIcon },
  { to: "/profile", label: "Profile", icon: UserIcon },
] as const

export function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="grid grid-cols-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.to
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={cn("size-5", active && "scale-110")}
                />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
