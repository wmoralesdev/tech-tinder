import { v } from "convex/values"
import { orderedPair } from "./lib/matches"
import { authedMutation } from "./lib/customFunctions"

export const swipe = authedMutation({
  args: {
    profileId: v.id("profiles"),
    direction: v.union(v.literal("like"), v.literal("pass")),
  },
  returns: v.object({
    matched: v.boolean(),
    matchId: v.optional(v.id("matches")),
  }),
  handler: async (ctx, args) => {
    const targetProfile = await ctx.db.get("profiles", args.profileId)
    if (!targetProfile || !targetProfile.isActive) {
      throw new Error("Profile not found")
    }

    if (targetProfile.userId === ctx.user._id) {
      throw new Error("You cannot swipe on your own profile")
    }

    const existingSwipe = await ctx.db
      .query("swipes")
      .withIndex("by_from_to", (q) =>
        q.eq("fromUserId", ctx.user._id).eq("toUserId", targetProfile.userId),
      )
      .unique()

    if (existingSwipe) {
      throw new Error("You already swiped on this profile")
    }

    const now = Date.now()
    await ctx.db.insert("swipes", {
      fromUserId: ctx.user._id,
      toUserId: targetProfile.userId,
      direction: args.direction,
      createdAt: now,
    })

    if (args.direction !== "like") {
      return { matched: false }
    }

    const reciprocalLike = await ctx.db
      .query("swipes")
      .withIndex("by_from_to", (q) =>
        q.eq("fromUserId", targetProfile.userId).eq("toUserId", ctx.user._id),
      )
      .unique()

    if (!reciprocalLike || reciprocalLike.direction !== "like") {
      return { matched: false }
    }

    const [userAId, userBId] = orderedPair(ctx.user._id, targetProfile.userId)
    const existingMatch = await ctx.db
      .query("matches")
      .withIndex("by_pair", (q) => q.eq("userAId", userAId).eq("userBId", userBId))
      .unique()

    if (existingMatch) {
      await ctx.db.patch("matches", existingMatch._id, { lastActivityAt: now })
      return { matched: true, matchId: existingMatch._id }
    }

    const matchId = await ctx.db.insert("matches", {
      userAId,
      userBId,
      createdAt: now,
      lastActivityAt: now,
    })

    return { matched: true, matchId }
  },
})
