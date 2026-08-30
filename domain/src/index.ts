/**
 * Punto de entrada publico del modulo de dominio.
 *
 * Define que es API del paquete y que es detalle interno. Quien lo consuma
 * deberia importar siempre desde aqui y nunca desde una ruta interna.
 */

export { puedeReservar, validarReserva } from "./application/puedeReservar.ts";
export type {
  Conflicto,
  MotivoRechazo,
  ResultadoValidacion,
} from "./application/puedeReservar.ts";

export { crearIntervalo, parsearHora } from "./domain/Intervalo.ts";
export type {
  Intervalo,
  MotivoIntervaloInvalido,
  Reserva,
  ResultadoIntervalo,
} from "./domain/Intervalo.ts";

export { clasificarSolapamiento, hayOverlap } from "./domain/solapamiento.ts";
export type { TipoSolapamiento } from "./domain/solapamiento.ts";
