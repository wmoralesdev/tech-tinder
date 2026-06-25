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

export function ProfileRequiredCard() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Profile required</CardTitle>
        <CardDescription>
          You can&apos;t swipe with a blank README.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Drop a short handle, headline, and at least one intent. Then get back to
        the merge queue.
      </CardContent>
      <CardFooter>
        <Button render={<Link to="/profile" />} nativeButton={false}>
          Build my profile
        </Button>
      </CardFooter>
    </Card>
  )
}
