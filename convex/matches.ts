import { v } from "convex/values"
import { intentValidator, profileLinksValidator } from "./schema"
import { authedQuery } from "./lib/customFunctions"

const matchSummaryValidator = v.object({
  matchId: v.id("matches"),
  createdAt: v.number(),
  lastActivityAt: v.number(),
  otherUserId: v.id("users"),
  otherUserName: v.string(),
  otherUserImageUrl: v.optional(v.string()),
  profile: v.union(
    v.object({
      profileId: v.id("profiles"),
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
    }),
    v.null(),
  ),
})

export const listMine = authedQuery({
  args: {},
  returns: v.array(matchSummaryValidator),
  handler: async (ctx) => {
    const matchesAsA = await ctx.db
      .query("matches")
      .withIndex("by_user_a", (q) => q.eq("userAId", ctx.user._id))
      .collect()

    const matchesAsB = await ctx.db
      .query("matches")
      .withIndex("by_user_b", (q) => q.eq("userBId", ctx.user._id))
      .collect()

    const allMatches = [...matchesAsA, ...matchesAsB]
    allMatches.sort((a, b) => b.lastActivityAt - a.lastActivityAt)

    const summaries = []
    for (const match of allMatches) {
      const otherUserId =
        match.userAId === ctx.user._id ? match.userBId : match.userAId

      const otherUser = await ctx.db.get("users", otherUserId)
      if (!otherUser) {
        continue
      }

      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", otherUserId))
        .unique()

      summaries.push({
        matchId: match._id,
        createdAt: match.createdAt,
        lastActivityAt: match.lastActivityAt,
        otherUserId,
        otherUserName: otherUser.name,
        otherUserImageUrl: otherUser.imageUrl,
        profile: profile
          ? {
              profileId: profile._id,
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
          : null,
      })
    }

    return summaries
  },
})
