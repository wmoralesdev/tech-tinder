"use client"

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { intentLabel } from "@/lib/profile-constants"
import { getPrimaryImageUrl } from "@/lib/profile-images"
import { ProtectedPage } from "@/components/protected-page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon } from "@hugeicons/core-free-icons"

export function MatchesPage() {
  return (
    <ProtectedPage>
      <MatchesList />
    </ProtectedPage>
  )
}

function MatchesList() {
  const matches = useQuery(api.matches.listMine)

  if (matches === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header>
        <h1 className="font-heading text-xl font-semibold">Matches</h1>
        <p className="text-sm text-muted-foreground">
          Mutual likes. Zero merge conflicts (for now).
        </p>
      </header>

      {matches.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>No matches yet</EmptyTitle>
            <EmptyDescription>
              Keep swiping. Someone out there also likes your commit messages.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="space-y-3">
          {matches.map((match) => {
            const profile = match.profile
            const imageUrl =
              (profile && getPrimaryImageUrl(profile)) ?? match.otherUserImageUrl

            return (
              <li key={match.matchId}>
                <Card>
                  <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <Avatar size="lg">
                      {imageUrl ? (
                        <AvatarImage src={imageUrl} alt={match.otherUserName} />
                      ) : null}
                      <AvatarFallback>
                        {match.otherUserName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate">
                        {profile?.displayName ?? match.otherUserName}
                      </CardTitle>
                      <CardDescription className="truncate">
                        {profile ? `@${profile.handle}` : "Profile loading..."}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  {profile ? (
                    <CardContent className="space-y-3">
                      <p className="text-sm">{profile.headline}</p>
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {profile.intents.map((intent) => (
                          <Badge key={intent} variant="secondary">
                            {intentLabel(intent)}
                          </Badge>
                        ))}
                      </div>

                      {profile.links ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {profile.links.github ? (
                            <a
                              href={profile.links.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              GitHub
                            </a>
                          ) : null}
                          {profile.links.website ? (
                            <a
                              href={profile.links.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              Website
                            </a>
                          ) : null}
                          {profile.links.x ? (
                            <a
                              href={profile.links.x}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              X
                            </a>
                          ) : null}
                          {profile.links.linkedin ? (
                            <a
                              href={profile.links.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              LinkedIn
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </CardContent>
                  ) : null}
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
