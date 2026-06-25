"use client"

import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SignedOutCard({
  title = "Sign in to swipe",
  description = "No auth token, no matches. Classic merge conflict.",
}: {
  title?: string
  description?: string
}) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Tech Tinder is for builders looking for romance, co-founders, project
        partners, and AI+tech friends.
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button render={<Link to="/sign-in" />} nativeButton={false}>
          Sign in
        </Button>
        <Button
          variant="outline"
          render={<Link to="/sign-up" />}
          nativeButton={false}
        >
          Sign up
        </Button>
      </CardFooter>
    </Card>
  )
}
