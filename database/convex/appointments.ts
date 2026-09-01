import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create_reservation = mutation({
    args: {
        professional_id: v.id("professional"),
        date: v.string(),
        start_time: v.string(),
        end_time: v.string(),
    },
    handler: async (ctx, args) => {
        if (args.start_time >= args.end_time)
            throw new Error("horas invalidas")

    const existing = await ctx.db
        .query("appointments")
        .withIndex("by_professional_and_date", (q) => 
            q.eq("professional_id",args.professional_id).eq("date", args.date)
        )
        .collect()

    const has_overlap = existing.some(
        (app) => args.start_time < app.end_time && args.end_time > app.start_time
    )

    if (has_overlap) {
        throw new Error("ya existe reserva en ese horario")
    }

    return await ctx.db.insert("appointments",args)
        }
})

export const get_appointments_by_professional = query({
    args: {
        professional_id: v.id("professional"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
        .query("appointments")
        .withIndex("by_professional_and_date", (q) => q.eq("professional_id", args.professional_id)
        )
        .collect()        
    },
})
