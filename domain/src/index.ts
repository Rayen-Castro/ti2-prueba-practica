/**
 * Punto de entrada publico del modulo de dominio.
 *
 * Define que es API del paquete y que es detalle interno. Quien lo consuma
 * deberia importar siempre desde aqui y nunca desde una ruta interna.
 */

export { puedeReservar, validarReserva } from "./application/puedeReservar";
export type {
  Conflicto,
  MotivoRechazo,
  ResultadoValidacion,
} from "./application/puedeReservar";

export { crearIntervalo, parsearHora } from "./domain/Intervalo";
export type {
  Intervalo,
  MotivoIntervaloInvalido,
  Reserva,
  ResultadoIntervalo,
} from "./domain/Intervalo";

export { clasificarSolapamiento, hayOverlap } from "./domain/solapamiento";
export type { TipoSolapamiento } from "./domain/solapamiento";
