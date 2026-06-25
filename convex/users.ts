import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const storeCurrentUser = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const now = Date.now()
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique()

    if (existingUser) {
      await ctx.db.patch("users", existingUser._id, {
        name: identity.name ?? existingUser.name,
        email: identity.email ?? existingUser.email,
        imageUrl: identity.pictureUrl ?? existingUser.imageUrl,
        updatedAt: now,
      })
      return existingUser._id
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "",
      imageUrl: identity.pictureUrl,
      createdAt: now,
      updatedAt: now,
    })
  },
})
