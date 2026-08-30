/**
 * Capa de dominio: regla de negocio que determina si dos intervalos chocan.
 *
 * Es logica pura: no conoce reservas, ni listas, ni el caso de uso que la
 * consume. Solo responde por la relacion entre dos rangos horarios.
 */

import type { Intervalo } from "./Intervalo.ts";

/** Relacion entre un intervalo nuevo y uno ya existente. */
export type TipoSolapamiento =
  | "SIN_SOLAPAMIENTO"
  | "PARCIAL"
  | "CONTENIDO"
  | "COMPLETO";

/**
 * Indica si dos intervalos comparten al menos un minuto.
 *
 * Las comparaciones son estrictas porque los intervalos son semiabiertos
 * [inicio, fin): si uno termina justo cuando el otro empieza, no hay conflicto.
 */
export function haySolapamiento(a: Intervalo, b: Intervalo): boolean {
  return (
    a.inicioEnMinutos < b.finEnMinutos && b.inicioEnMinutos < a.finEnMinutos
  );
}

/**
 * Clasifica el tipo de choque entre un intervalo nuevo y uno existente.
 *
 * - COMPLETO:  el nuevo cubre por entero al existente (incluye rangos identicos).
 * - CONTENIDO: el nuevo cae por completo dentro del existente.
 * - PARCIAL:   se cruzan solo por un extremo.
 *
 * Cuando ambos rangos son identicos se cumplen a la vez las condiciones de
 * COMPLETO y CONTENIDO; se resuelve como COMPLETO por evaluarse primero.
 */
export function clasificarSolapamiento(
  nuevo: Intervalo,
  existente: Intervalo,
): TipoSolapamiento {
  if (!haySolapamiento(nuevo, existente)) {
    return "SIN_SOLAPAMIENTO";
  }

  const cubreAlExistente =
    nuevo.inicioEnMinutos <= existente.inicioEnMinutos &&
    nuevo.finEnMinutos >= existente.finEnMinutos;

  if (cubreAlExistente) {
    return "COMPLETO";
  }

  const cabeDentroDelExistente =
    nuevo.inicioEnMinutos >= existente.inicioEnMinutos &&
    nuevo.finEnMinutos <= existente.finEnMinutos;

  if (cabeDentroDelExistente) {
    return "CONTENIDO";
  }

  return "PARCIAL";
}
