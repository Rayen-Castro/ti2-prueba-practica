import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validarTransicionEstado, EstadoSolicitud } from "./solicitudesLogic";

// 1. Crear solicitud
export const crear = mutation({
  args: {
    titulo: v.string(),
    descripcion: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("solicitudes", {
      titulo: args.titulo,
      descripcion: args.descripcion,
      estado: "recibida",
    });
  },
});

// 2. Listar solicitudes
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("solicitudes").collect();
  },
});

// 3. Consultar una solicitud por ID
export const obtenerPorId = query({
  args: { id: v.id("solicitudes") },
  handler: async (ctx, args) => {
    const solicitud = await ctx.db.get(args.id);
    if (!solicitud) {
      throw new Error("La solicitud no existe.");
    }
    return solicitud;
  },
});

// 4. Cambiar el estado de una solicitud
export const cambiarEstado = mutation({
  args: {
    id: v.id("solicitudes"),
    nuevoEstado: v.union(
      v.literal("recibida"),
      v.literal("en_revision"),
      v.literal("aceptada"),
      v.literal("cerrada")
    ),
  },
  handler: async (ctx, args) => {
    const solicitud = await ctx.db.get(args.id);
    if (!solicitud) {
      throw new Error("Solicitud no encontrada.");
    }

    // Aplica la regla de validación definida en solicitudesLogic.ts
    validarTransicionEstado(
      solicitud.estado as EstadoSolicitud,
      args.nuevoEstado as EstadoSolicitud
    );

    await ctx.db.patch(args.id, { estado: args.nuevoEstado });
    return { exito: true };
  },
});