import { createFileRoute } from "@tanstack/react-router"
import { MatchesPage } from "@/components/matches-page"

export const Route = createFileRoute("/matches")({
  component: MatchesPage,
})
