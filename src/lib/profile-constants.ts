export const PROFILE_LIMITS = {
  headline: 80,
  bio: 240,
  techTags: 8,
  images: 3,
  intentsMin: 1,
  intentsMax: 4,
} as const

export type IntentValue =
  | "romantic"
  | "project_partner"
  | "co_founder"
  | "ai_tech_friends"

export const INTENT_OPTIONS: Array<{ value: IntentValue; label: string }> = [
  { value: "romantic", label: "Ship it 💘" },
  { value: "project_partner", label: "Pair programmer" },
  { value: "co_founder", label: "Co-founder wanted" },
  { value: "ai_tech_friends", label: "Rubber duck club" },
]

export function intentLabel(value: IntentValue): string {
  return INTENT_OPTIONS.find((option) => option.value === value)?.label ?? value
}
