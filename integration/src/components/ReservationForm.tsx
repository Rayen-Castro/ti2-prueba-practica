import type { FormEvent } from "react";

interface ReservationFormProps {
  patientName: string;
  onPatientNameChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}

export function ReservationForm({
  patientName,
  onPatientNameChange,
  onSubmit,
  disabled,
  isSubmitting,
}: ReservationFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <label htmlFor="patientName">Nombre del paciente</label>
      <input
        id="patientName"
        type="text"
        value={patientName}
        onChange={(e) => onPatientNameChange(e.target.value)}
        placeholder="Ej: Juan Pérez"
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? "Reservando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
