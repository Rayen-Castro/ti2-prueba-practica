// Capa de SERVICIO.
// Esta capa simula una API real: expone funciones asíncronas que la
// interfaz consume sin saber cómo están implementadas por dentro.
// Si en el futuro esto se reemplaza por fetch() a un backend real,
// la interfaz (App.tsx / componentes) NO debería tener que cambiar.

import { ReservationApiError } from "../types";
import type { Reservation, Slot } from "../types";

// "Base de datos" en memoria, con datos ficticios.
let slots: Slot[] = [
  { id: "slot-1", professional: "Dra. Camila Rojas", date: "2025-09-01", time: "09:00", status: "disponible" },
  { id: "slot-2", professional: "Dra. Camila Rojas", date: "2025-09-01", time: "10:00", status: "disponible" },
  { id: "slot-3", professional: "Dr. Ignacio Soto", date: "2025-09-01", time: "11:30", status: "disponible" },
  { id: "slot-4", professional: "Dr. Ignacio Soto", date: "2025-09-02", time: "15:00", status: "reservado" },
  { id: "slot-5", professional: "Dra. Fernanda Muñoz", date: "2025-09-02", time: "16:30", status: "disponible" },
];

const reservations: Reservation[] = [];

// Retraso artificial para simular latencia de red real.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Obtiene los horarios disponibles.
 * Simula una llamada de red con retraso y una probabilidad baja de error,
 * para poder demostrar el manejo de errores en la interfaz.
 */
export async function getAvailableSlots(): Promise<Slot[]> {
  await delay(700);

  const simulatedNetworkFailure = Math.random() < 0.08; // ~8% de las veces
  if (simulatedNetworkFailure) {
    throw new ReservationApiError("No se pudo conectar con el servicio de horarios. Intenta nuevamente.");
  }

  return slots.filter((slot) => slot.status === "disponible");
}

/**
 * Crea una reserva para un horario específico.
 * Reglas simuladas:
 *  - El horario debe existir.
 *  - El horario debe seguir disponible (evita doble reserva).
 */
export async function createReservation(slotId: string, patientName: string): Promise<Reservation> {
  await delay(600);

  const slot = slots.find((s) => s.id === slotId);

  if (!slot) {
    throw new ReservationApiError("El horario seleccionado ya no existe.");
  }

  if (slot.status !== "disponible") {
    throw new ReservationApiError("Este horario ya fue reservado por otra persona.");
  }

  if (!patientName.trim()) {
    throw new ReservationApiError("Debes indicar un nombre para reservar.");
  }

  // Actualiza el estado del horario (simula la escritura en la "base de datos").
  slots = slots.map((s) => (s.id === slotId ? { ...s, status: "reservado" } : s));

  const reservation: Reservation = {
    id: `res-${Date.now()}`,
    slotId,
    patientName: patientName.trim(),
    createdAt: new Date().toISOString(),
  };

  reservations.push(reservation);
  return reservation;
}
