import { intentValidator } from "../schema"

const HANDLE_PATTERN = /^[a-z0-9_]{3,24}$/

export function validateHandle(handle: string): void {
  if (!HANDLE_PATTERN.test(handle)) {
    throw new Error("Handle must be 3-24 lowercase letters, numbers, or underscores")
  }
}

export function validateProfileFields(args: {
  headline: string
  bio: string
  handle: string
  techTags: string[]
  intents: Array<
    "romantic" | "project_partner" | "co_founder" | "ai_tech_friends"
  >
  imageStorageIds: string[]
  imageUrls?: string[]
}): void {
  validateHandle(args.handle)

  if (args.headline.length > 80) {
    throw new Error("Headline must be 80 characters or fewer")
  }

  if (args.bio.length > 240) {
    throw new Error("Bio must be 240 characters or fewer")
  }

  if (args.techTags.length > 8) {
    throw new Error("You can add up to 8 tech tags")
  }

  if (args.intents.length > 4 || args.intents.length === 0) {
    throw new Error("Choose 1-4 connection intents")
  }

  const imageCount = args.imageStorageIds.length + (args.imageUrls?.length ?? 0)
  if (imageCount > 3) {
    throw new Error("Profiles can include up to 3 images")
  }
}

export { intentValidator }
