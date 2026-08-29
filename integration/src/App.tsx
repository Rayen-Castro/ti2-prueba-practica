import { useEffect, useState } from "react";
import { ReservationApiError } from "./types";
import type { Slot, Reservation } from "./types";
import { getAvailableSlots, createReservation } from "./services/reservationService";
import { SlotList } from "./components/SlotList";
import { ReservationForm } from "./components/ReservationForm";
import { StatusMessage } from "./components/StatusMessage";
import "./styles.css";

type LoadState = "loading" | "loaded" | "error";
type SubmitState = "idle" | "submitting" | "success" | "error";

// Este componente es la capa INTERFAZ.
// Su única responsabilidad es:
//  1. Pedir datos al servicio.
//  2. Mostrar el estado (cargando / error / datos).
//  3. Delegar acciones del usuario al servicio.
// No conoce ningún detalle de cómo el servicio obtiene o guarda los datos.
export default function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    setLoadState("loading");
    setLoadError(null);
    try {
      const availableSlots = await getAvailableSlots();
      setSlots(availableSlots);
      setLoadState("loaded");
    } catch (error) {
      setLoadState("error");
      setLoadError(toErrorMessage(error));
    }
  }

  async function handleReserve() {
    if (!selectedSlotId) return;

    setSubmitState("submitting");
    setSubmitError(null);

    try {
      const reservation = await createReservation(selectedSlotId, patientName);
      setConfirmedReservation(reservation);
      setSubmitState("success");
      // Refresca la lista para reflejar que el horario ya no está disponible.
      setSlots((prev) => prev.filter((slot) => slot.id !== selectedSlotId));
      setSelectedSlotId(null);
      setPatientName("");
    } catch (error) {
      setSubmitState("error");
      setSubmitError(toErrorMessage(error));
    }
  }

  function toErrorMessage(error: unknown): string {
    if (error instanceof ReservationApiError) return error.message;
    return "Ocurrió un error inesperado.";
  }

  return (
    <main className="app">
      <h1>Reserva de horarios</h1>
      <p className="subtitle">Actividad 5 · Integración de frontend y servicios (API simulada)</p>

      <section>
        <h2>1. Horarios disponibles</h2>

        {loadState === "loading" && <StatusMessage type="loading" message="Cargando horarios disponibles..." />}

        {loadState === "error" && (
          <>
            <StatusMessage type="error" message={loadError ?? "No se pudieron cargar los horarios."} />
            <button type="button" onClick={loadSlots}>
              Reintentar
            </button>
          </>
        )}

        {loadState === "loaded" && (
          <SlotList slots={slots} selectedSlotId={selectedSlotId} onSelect={setSelectedSlotId} />
        )}
      </section>

      {loadState === "loaded" && (
        <section>
          <h2>2. Confirmar reserva</h2>

          {!selectedSlotId && <p className="hint">Selecciona un horario para continuar.</p>}

          {selectedSlotId && (
            <ReservationForm
              patientName={patientName}
              onPatientNameChange={setPatientName}
              onSubmit={handleReserve}
              disabled={submitState === "submitting"}
              isSubmitting={submitState === "submitting"}
            />
          )}

          {submitState === "error" && (
            <StatusMessage type="error" message={submitError ?? "No se pudo completar la reserva."} />
          )}

          {submitState === "success" && confirmedReservation && (
            <StatusMessage
              type="success"
              message={`Reserva confirmada para ${confirmedReservation.patientName} (ID: ${confirmedReservation.id}).`}
            />
          )}
        </section>
      )}
    </main>
  );
}
