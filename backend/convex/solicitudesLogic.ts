export type EstadoSolicitud = "recibida" | "en_revision" | "aceptada" | "cerrada";

// Matriz de transiciones permitidas
const TRANSICIONES_VALIDAS: Record<EstadoSolicitud, EstadoSolicitud[]> = {
  recibida: ["en_revision", "cerrada"],
  en_revision: ["aceptada", "cerrada"],
  aceptada: ["cerrada"],
  cerrada: [], // Si está cerrada no puede cambiar a ningún otro estado
};

export function validarTransicionEstado(
  estadoActual: EstadoSolicitud,
  nuevoEstado: EstadoSolicitud
): void {
  const permitidos = TRANSICIONES_VALIDAS[estadoActual];
  
  if (!permitidos.includes(nuevoEstado)) {
    throw new Error(
      `Transición inválida: no se puede cambiar de "${estadoActual}" a "${nuevoEstado}".`
    );
  }
}