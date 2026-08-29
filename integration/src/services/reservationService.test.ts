import { describe, expect, it, vi, beforeEach } from "vitest";
import { getAvailableSlots, createReservation } from "./reservationService";
import { ReservationApiError } from "../types";

describe("reservationService", () => {
  beforeEach(() => {
    // Fuerza que las fallas aleatorias simuladas nunca ocurran durante los tests,
    // para que las pruebas sean deterministas.
    vi.spyOn(Math, "random").mockReturnValue(0.99);
  });

  it("retorna solo los horarios disponibles", async () => {
    const slots = await getAvailableSlots();
    expect(slots.every((slot) => slot.status === "disponible")).toBe(true);
    expect(slots.length).toBeGreaterThan(0);
  });

  it("crea una reserva para un horario disponible", async () => {
    const slots = await getAvailableSlots();
    const target = slots[0];

    const reservation = await createReservation(target.id, "Ana Torres");

    expect(reservation.slotId).toBe(target.id);
    expect(reservation.patientName).toBe("Ana Torres");
    expect(reservation.id).toBeTruthy();
  });

  it("impide reservar dos veces el mismo horario", async () => {
    const slots = await getAvailableSlots();
    const target = slots[0];

    await createReservation(target.id, "Primer paciente");

    await expect(createReservation(target.id, "Segundo paciente")).rejects.toBeInstanceOf(ReservationApiError);
  });

  it("rechaza la reserva si no se indica un nombre", async () => {
    const slots = await getAvailableSlots();
    const target = slots.find((s) => s.status === "disponible");

    await expect(createReservation(target!.id, "   ")).rejects.toThrow(
      "Debes indicar un nombre para reservar."
    );
  });

  it("rechaza la reserva de un horario inexistente", async () => {
    await expect(createReservation("slot-inexistente", "Alguien")).rejects.toBeInstanceOf(ReservationApiError);
  });
});
