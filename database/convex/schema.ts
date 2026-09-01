import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    professional: defineTable({
        name: v.string(),
    }),
    appointments: defineTable({
        professional_id: v.id("professional"),
        date: v.string(),
        start_time: v.string(),
        end_time: v.string(),
    }).index("by_professional_and_date", ["professional_id", "date"]),
})
