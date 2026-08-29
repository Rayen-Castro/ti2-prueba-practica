// Tipos compartidos entre la interfaz y el servicio simulado.
// Representan la forma de las "respuestas" que entrega la API simulada.

export type SlotStatus = "disponible" | "reservado";

export interface Slot {
  id: string;
  professional: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:mm
  status: SlotStatus;
}

export interface Reservation {
  id: string;
  slotId: string;
  patientName: string;
  createdAt: string; // ISO date string
}

// Error controlado que puede lanzar el servicio simulado.
// Permite diferenciar errores "esperados" (ej: horario ya tomado)
// de errores inesperados al momento de mostrar el mensaje en la interfaz.
export class ReservationApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReservationApiError";
  }
}
