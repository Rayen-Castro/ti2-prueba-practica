/**
 * Capa de aplicacion: caso de uso "puedo agendar este horario?".
 *
 * Orquesta las reglas de la capa de dominio, pero no define ninguna regla
 * propia: se limita a construir los intervalos y recorrer la agenda.
 */

import {
  crearIntervalo,
  type MotivoIntervaloInvalido,
  type Reserva,
} from "../domain/Intervalo";
import {
  clasificarSolapamiento,
  type TipoSolapamiento,
} from "../domain/solapamiento";

/** Tipos de choque reales, excluyendo el caso en que no hay conflicto. */
export type Conflicto = Exclude<TipoSolapamiento, "SIN_SOLAPAMIENTO">;

/** Explicacion de por que una reserva no puede realizarse. */
export type MotivoRechazo =
  | {
      readonly tipo: "SOLICITUD_INVALIDA";
      readonly motivo: MotivoIntervaloInvalido;
    }
  | {
      readonly tipo: "AGENDA_INVALIDA";
      readonly motivo: MotivoIntervaloInvalido;
      readonly reserva: Reserva;
    }
  | {
      readonly tipo: "SOLAPAMIENTO";
      readonly conflicto: Conflicto;
      readonly reserva: Reserva;
    };

/** Respuesta detallada del caso de uso. */
export type ResultadoValidacion =
  | { readonly permitido: true }
  | { readonly permitido: false; readonly rechazo: MotivoRechazo };

/**
 * Evalua si una reserva nueva puede agendarse sobre una agenda existente y
 * explica el motivo cuando no es posible.
 *
 * Si alguna reserva ya agendada tiene un horario invalido, el caso de uso
 * rechaza la solicitud en lugar de ignorarla: ante datos que no se pueden
 * interpretar es preferible negar el agendamiento antes que afirmar una
 * disponibilidad que no se logro verificar.
 */
export function validarReserva(
  reservas: readonly Reserva[],
  nueva: Reserva,
): ResultadoValidacion {
  const solicitada = crearIntervalo(nueva);

  if (!solicitada.valido) {
    return {
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: solicitada.motivo },
    };
  }

  for (const reserva of reservas) {
    const agendada = crearIntervalo(reserva);

    if (!agendada.valido) {
      return {
        permitido: false,
        rechazo: { tipo: "AGENDA_INVALIDA", motivo: agendada.motivo, reserva },
      };
    }

    const conflicto = clasificarSolapamiento(
      solicitada.intervalo,
      agendada.intervalo,
    );

    if (conflicto !== "SIN_SOLAPAMIENTO") {
      return {
        permitido: false,
        rechazo: { tipo: "SOLAPAMIENTO", conflicto, reserva },
      };
    }
  }

  return { permitido: true };
}

/**
 * Version booleana del caso de uso, tal como la define el enunciado.
 *
 * @example
 * puedeReservar(
 *   [{ inicio: "09:00", fin: "10:00" }, { inicio: "11:00", fin: "12:00" }],
 *   { inicio: "09:30", fin: "10:30" },
 * ); // false
 */
export function puedeReservar(
  reservas: readonly Reserva[],
  nueva: Reserva,
): boolean {
  return validarReserva(reservas, nueva).permitido;
}
