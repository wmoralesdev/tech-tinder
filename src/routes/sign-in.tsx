import { createFileRoute } from "@tanstack/react-router"
import { SignIn } from "@clerk/tanstack-react-start"

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
})

function SignInPage() {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_oklch(0.92_0.04_330)_0%,_var(--background)_45%)] dark:bg-[radial-gradient(circle_at_top,_oklch(0.28_0.05_330)_0%,_var(--background)_50%)]">
      <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center bg-background/90 p-4 shadow-xl ring-1 ring-border/60 backdrop-blur-sm dark:bg-background/80">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in and stop swiping on LinkedIn DMs.
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/discover"
        />
      </main>
    </div>
  )
}
