"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { BottomNav } from "@/components/bottom-nav"

export function AppShell({
  children,
  showNav = true,
  className,
}: {
  children: ReactNode
  showNav?: boolean
  className?: string
}) {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_oklch(0.92_0.04_330)_0%,_var(--background)_45%)] dark:bg-[radial-gradient(circle_at_top,_oklch(0.28_0.05_330)_0%,_var(--background)_50%)]">
      <div
        className={cn(
          "relative mx-auto flex min-h-svh w-full max-w-md flex-col bg-background/90 shadow-xl ring-1 ring-border/60 backdrop-blur-sm dark:bg-background/80",
          showNav && "pb-[calc(4.5rem+env(safe-area-inset-bottom))]",
          className,
        )}
      >
        {children}
        {showNav ? <BottomNav /> : null}
      </div>
    </div>
  )
}
