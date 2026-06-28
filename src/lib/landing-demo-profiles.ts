import type { IntentValue } from "@/lib/profile-constants"

export type LandingDemoProfile = {
  displayName: string
  handle: string
  headline: string
  techTags: string[]
  intents: IntentValue[]
  accent: "rose" | "violet" | "cyan"
}

export const LANDING_DEMO_PROFILES: LandingDemoProfile[] = [
  {
    displayName: "Maya K.",
    handle: "mayak",
    headline: "Reads the diff before approving your PR",
    techTags: ["TypeScript", "Convex", "Design systems"],
    intents: ["romantic", "project_partner"],
    accent: "rose",
  },
  {
    displayName: "Devon R.",
    handle: "devonr",
    headline: "Co-founder wanted. Tolerates 2am quick-fix commits",
    techTags: ["Rust", "LLMs", "Infra"],
    intents: ["co_founder", "ai_tech_friends"],
    accent: "violet",
  },
  {
    displayName: "Sam L.",
    handle: "saml",
    headline: "Rubber duck who actually answers back",
    techTags: ["React", "Agents", "PWA"],
    intents: ["ai_tech_friends", "project_partner"],
    accent: "cyan",
  },
]

export const LANDING_QUOTES = [
  "Swipe left on merge conflicts. Swipe right on shared roadmaps.",
  "Short profiles. No LinkedIn novels. Just builders.",
  "Find a co-founder, a pair partner, or your favorite chaos gremlin.",
  "Like someone? If they like you back, you match. Then ship something.",
]
