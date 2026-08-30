import { describe, expect, it } from "vitest";

import type { Reserva } from "../../src/domain/Intervalo";
import { puedeReservar, validarReserva } from "../../src/index";

/** Agenda de ejemplo del enunciado. */
const reservas: readonly Reserva[] = [
  { inicio: "09:00", fin: "10:00" },
  { inicio: "11:00", fin: "12:00" },
];

describe("puedeReservar", () => {
  it("resuelve el ejemplo del enunciado como no reservable", () => {
    expect(puedeReservar(reservas, { inicio: "09:30", fin: "10:30" })).toBe(
      false,
    );
  });

  it("permite un horario disponible entre dos reservas", () => {
    expect(puedeReservar(reservas, { inicio: "10:00", fin: "11:00" })).toBe(
      true,
    );
  });

  it("permite cualquier horario valido cuando la agenda esta vacia", () => {
    expect(puedeReservar([], { inicio: "08:00", fin: "09:00" })).toBe(true);
  });

  it("permite un horario que empieza justo cuando termina otra reserva", () => {
    expect(puedeReservar(reservas, { inicio: "12:00", fin: "13:00" })).toBe(
      true,
    );
  });

  it("rechaza un solapamiento parcial", () => {
    expect(puedeReservar(reservas, { inicio: "08:30", fin: "09:30" })).toBe(
      false,
    );
  });

  it("rechaza un horario que cubre por completo a una reserva", () => {
    expect(puedeReservar(reservas, { inicio: "08:00", fin: "13:00" })).toBe(
      false,
    );
  });

  it("rechaza un horario contenido dentro de una reserva", () => {
    expect(puedeReservar(reservas, { inicio: "09:15", fin: "09:45" })).toBe(
      false,
    );
  });

  it("rechaza un intervalo invalido", () => {
    expect(puedeReservar(reservas, { inicio: "15:00", fin: "14:00" })).toBe(
      false,
    );
  });

  it("rechaza un intervalo con inicio y termino iguales", () => {
    expect(puedeReservar(reservas, { inicio: "14:00", fin: "14:00" })).toBe(
      false,
    );
  });
});

describe("validarReserva", () => {
  it("informa que no hay impedimento cuando el horario esta disponible", () => {
    expect(validarReserva(reservas, { inicio: "14:00", fin: "15:00" })).toEqual({
      permitido: true,
    });
  });

  it("identifica el solapamiento parcial y la reserva en conflicto", () => {
    expect(validarReserva(reservas, { inicio: "09:30", fin: "10:30" })).toEqual({
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "PARCIAL",
        reserva: { inicio: "09:00", fin: "10:00" },
      },
    });
  });

  it("identifica un horario contenido dentro de otro", () => {
    expect(validarReserva(reservas, { inicio: "11:15", fin: "11:45" })).toEqual({
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "CONTENIDO",
        reserva: { inicio: "11:00", fin: "12:00" },
      },
    });
  });

  it("identifica un solapamiento completo", () => {
    expect(validarReserva(reservas, { inicio: "08:00", fin: "10:30" })).toEqual({
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "COMPLETO",
        reserva: { inicio: "09:00", fin: "10:00" },
      },
    });
  });

  it("trata una reserva identica a una existente como solapamiento completo", () => {
    expect(validarReserva(reservas, { inicio: "09:00", fin: "10:00" })).toEqual({
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "COMPLETO",
        reserva: { inicio: "09:00", fin: "10:00" },
      },
    });
  });

  it("informa el motivo cuando el intervalo solicitado es invalido", () => {
    expect(validarReserva(reservas, { inicio: "15:00", fin: "14:00" })).toEqual({
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "INTERVALO_INVALIDO" },
    });
  });

  it("informa el motivo cuando el inicio y el termino son iguales", () => {
    expect(validarReserva(reservas, { inicio: "14:00", fin: "14:00" })).toEqual({
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "DURACION_CERO" },
    });
  });

  it("informa el motivo cuando el horario solicitado tiene formato invalido", () => {
    expect(validarReserva(reservas, { inicio: "9:00", fin: "10:00" })).toEqual({
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "FORMATO_INVALIDO" },
    });
  });

  it("rechaza la solicitud si la agenda contiene un horario ilegible", () => {
    const agendaCorrupta: readonly Reserva[] = [{ inicio: "99:99", fin: "10:00" }];

    expect(
      validarReserva(agendaCorrupta, { inicio: "14:00", fin: "15:00" }),
    ).toEqual({
      permitido: false,
      rechazo: {
        tipo: "AGENDA_INVALIDA",
        motivo: "FORMATO_INVALIDO",
        reserva: { inicio: "99:99", fin: "10:00" },
      },
    });
  });

  it("valida la solicitud antes que la agenda", () => {
    const agendaCorrupta: readonly Reserva[] = [{ inicio: "99:99", fin: "10:00" }];

    expect(
      validarReserva(agendaCorrupta, { inicio: "15:00", fin: "14:00" }),
    ).toEqual({
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "INTERVALO_INVALIDO" },
    });
  });
});
