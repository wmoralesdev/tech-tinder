import { v } from "convex/values"
import { intentValidator, profileLinksValidator } from "./schema"
import { authedMutation, authedQuery } from "./lib/customFunctions"
import { validateProfileFields } from "./lib/validators"

const profileDocValidator = v.object({
  _id: v.id("profiles"),
  _creationTime: v.number(),
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

const discoveryProfileValidator = v.object({
  profileId: v.id("profiles"),
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
})

export const getMine = authedQuery({
  args: {},
  returns: v.union(profileDocValidator, v.null()),
  handler: async (ctx) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user._id))
      .unique()
  },
})

export const upsertMine = authedMutation({
  args: {
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
  },
  returns: v.id("profiles"),
  handler: async (ctx, args) => {
    validateProfileFields(args)

    const now = Date.now()
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user._id))
      .unique()

    if (existing) {
      await ctx.db.patch("profiles", existing._id, {
        ...args,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("profiles", {
      userId: ctx.user._id,
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const generateUploadUrl = authedMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

export const getDiscoveryCandidates = authedQuery({
  args: {
    limit: v.number(),
  },
  returns: v.array(discoveryProfileValidator),
  handler: async (ctx, args) => {
    const boundedLimit = Math.min(Math.max(args.limit, 1), 50)

    const mySwipes = await ctx.db
      .query("swipes")
      .withIndex("by_from", (q) => q.eq("fromUserId", ctx.user._id))
      .collect()

    const swipedUserIds = new Set(mySwipes.map((swipe) => swipe.toUserId))

    const candidates = await ctx.db
      .query("profiles")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .take(boundedLimit * 4)

    const results = []
    for (const profile of candidates) {
      if (profile.userId === ctx.user._id) {
        continue
      }
      if (swipedUserIds.has(profile.userId)) {
        continue
      }

      results.push({
        profileId: profile._id,
        userId: profile.userId,
        handle: profile.handle,
        displayName: profile.displayName,
        headline: profile.headline,
        bio: profile.bio,
        imageStorageIds: profile.imageStorageIds,
        imageUrls: profile.imageUrls,
        intents: profile.intents,
        techTags: profile.techTags,
        location: profile.location,
        links: profile.links,
      })

      if (results.length >= boundedLimit) {
        break
      }
    }

    return results
  },
})

export const getByUser = authedQuery({
  args: {
    userId: v.id("users"),
  },
  returns: v.union(discoveryProfileValidator, v.null()),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique()

    if (!profile || !profile.isActive) {
      return null
    }

    return {
      profileId: profile._id,
      userId: profile.userId,
      handle: profile.handle,
      displayName: profile.displayName,
      headline: profile.headline,
      bio: profile.bio,
      imageStorageIds: profile.imageStorageIds,
      imageUrls: profile.imageUrls,
      intents: profile.intents,
      techTags: profile.techTags,
      location: profile.location,
      links: profile.links,
    }
  },
})
