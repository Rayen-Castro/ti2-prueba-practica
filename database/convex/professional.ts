import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create_professional = mutation({
    args: {
        name: v.string(),
    },
    handler: async(ctx, args) => {
        return await ctx.db.insert("professional",args)
    },
})
