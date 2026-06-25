import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export const intentValidator = v.union(
  v.literal("romantic"),
  v.literal("project_partner"),
  v.literal("co_founder"),
  v.literal("ai_tech_friends"),
)

export const profileLinksValidator = v.object({
  github: v.optional(v.string()),
  website: v.optional(v.string()),
  x: v.optional(v.string()),
  linkedin: v.optional(v.string()),
})

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  profiles: defineTable({
    userId: v.id("users"),
    handle: v.string(),
    displayName: v.string(),
    headline: v.string(),
    bio: v.string(),
    imageStorageIds: v.array(v.id("_storage")),
    imageUrls: v.optional(v.array(v.string())),
    intents: v.array(intentValidator),
    techTags: v.array(v.string()),
    location: v.optional(v.string()),
    links: v.optional(profileLinksValidator),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"]),

  swipes: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    direction: v.union(v.literal("like"), v.literal("pass")),
    createdAt: v.number(),
  })
    .index("by_from_to", ["fromUserId", "toUserId"])
    .index("by_to", ["toUserId"])
    .index("by_from", ["fromUserId"]),

  matches: defineTable({
    userAId: v.id("users"),
    userBId: v.id("users"),
    createdAt: v.number(),
    lastActivityAt: v.number(),
  })
    .index("by_user_a", ["userAId"])
    .index("by_user_b", ["userBId"])
    .index("by_pair", ["userAId", "userBId"]),
})
