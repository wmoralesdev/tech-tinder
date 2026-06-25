import { PROFILE_LIMITS } from "./profile-constants"

export function parseTechTags(raw: string): string[] {
  const tags = raw
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

  return tags.slice(0, PROFILE_LIMITS.techTags)
}

export function formatTechTags(tags: string[]): string {
  return tags.join(", ")
}
