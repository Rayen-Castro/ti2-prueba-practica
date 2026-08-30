import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  solicitudes: defineTable({
    titulo: v.string(),
    descripcion: v.string(),
    estado: v.union(
      v.literal("recibida"),
      v.literal("en_revision"),
      v.literal("aceptada"),
      v.literal("cerrada")
    ),
  }),
});