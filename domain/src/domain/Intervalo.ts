/**
 * Capa de dominio: representacion y validacion de un rango horario.
 *
 * Un intervalo se interpreta como semiabierto [inicio, fin): el minuto de
 * inicio pertenece al intervalo, el de termino no. Gracias a eso dos reservas
 * que se tocan por el borde (09:00-10:00 y 10:00-11:00) no se consideran
 * superpuestas.
 */

/** Rango horario tal como lo entrega el exterior, en formato "HH:mm". */
export interface Reserva {
  readonly inicio: string;
  readonly fin: string;
}

/** Rango horario ya validado y normalizado a minutos desde medianoche. */
export interface Intervalo {
  readonly inicioEnMinutos: number;
  readonly finEnMinutos: number;
}

/** Razones por las que un rango horario no puede convertirse en Intervalo. */
export type MotivoIntervaloInvalido =
  | "FORMATO_INVALIDO"
  | "DURACION_CERO"
  | "INTERVALO_INVALIDO";

/** Resultado de intentar construir un Intervalo, sin recurrir a excepciones. */
export type ResultadoIntervalo =
  | { readonly valido: true; readonly intervalo: Intervalo }
  | { readonly valido: false; readonly motivo: MotivoIntervaloInvalido };

/** Acepta unicamente horas de 00:00 a 23:59. */
const FORMATO_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

const MINUTOS_POR_HORA = 60;

/**
 * Convierte una hora "HH:mm" a minutos desde medianoche.
 * Devuelve null si el formato no es valido.
 */
export function parsearHora(hora: string): number | null {
  const coincidencia = FORMATO_HORA.exec(hora);
  if (coincidencia === null) {
    return null;
  }

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);

  return horas * MINUTOS_POR_HORA + minutos;
}

/**
 * Construye un Intervalo a partir de una reserva, validando formato y rango.
 *
 * El orden de las validaciones importa: el caso "inicio y termino iguales" se
 * evalua antes que el de inicio posterior al fin, para poder distinguirlo como
 * un motivo propio en lugar de mezclarlo con cualquier rango invertido.
 */
export function crearIntervalo(reserva: Reserva): ResultadoIntervalo {
  const inicioEnMinutos = parsearHora(reserva.inicio);
  const finEnMinutos = parsearHora(reserva.fin);

  if (inicioEnMinutos === null || finEnMinutos === null) {
    return { valido: false, motivo: "FORMATO_INVALIDO" };
  }

  if (inicioEnMinutos === finEnMinutos) {
    return { valido: false, motivo: "DURACION_CERO" };
  }

  if (inicioEnMinutos > finEnMinutos) {
    return { valido: false, motivo: "INTERVALO_INVALIDO" };
  }

  return { valido: true, intervalo: { inicioEnMinutos, finEnMinutos } };
}
