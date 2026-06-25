import { createFileRoute } from "@tanstack/react-router"
import { DiscoverPage } from "@/components/discover-page"

export const Route = createFileRoute("/discover")({
  component: DiscoverPage,
})
