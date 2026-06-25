import { createFileRoute } from "@tanstack/react-router"
import { SignUp } from "@clerk/tanstack-react-start"

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_oklch(0.92_0.04_330)_0%,_var(--background)_45%)] dark:bg-[radial-gradient(circle_at_top,_oklch(0.28_0.05_330)_0%,_var(--background)_50%)]">
      <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center bg-background/90 p-4 shadow-xl ring-1 ring-border/60 backdrop-blur-sm dark:bg-background/80">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-semibold">Join the stack</h1>
          <p className="text-sm text-muted-foreground">
            Create an account. Your rubber duck awaits.
          </p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/profile"
        />
      </main>
    </div>
  )
}
