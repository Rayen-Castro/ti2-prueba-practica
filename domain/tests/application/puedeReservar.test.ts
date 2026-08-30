import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Reserva } from "../../src/domain/Intervalo.ts";
import { puedeReservar, validarReserva } from "../../src/index.ts";

/** Agenda de ejemplo del enunciado. */
const reservas: readonly Reserva[] = [
  { inicio: "09:00", fin: "10:00" },
  { inicio: "11:00", fin: "12:00" },
];

describe("puedeReservar", () => {
  it("resuelve el ejemplo del enunciado como no reservable", () => {
    assert.equal(puedeReservar(reservas, { inicio: "09:30", fin: "10:30" }), false);
  });

  it("permite un horario disponible entre dos reservas", () => {
    assert.equal(puedeReservar(reservas, { inicio: "10:00", fin: "11:00" }), true);
  });

  it("permite cualquier horario valido cuando la agenda esta vacia", () => {
    assert.equal(puedeReservar([], { inicio: "08:00", fin: "09:00" }), true);
  });

  it("permite un horario que empieza justo cuando termina otra reserva", () => {
    assert.equal(puedeReservar(reservas, { inicio: "12:00", fin: "13:00" }), true);
  });

  it("rechaza un solapamiento parcial", () => {
    assert.equal(puedeReservar(reservas, { inicio: "08:30", fin: "09:30" }), false);
  });

  it("rechaza un horario que cubre por completo a una reserva", () => {
    assert.equal(puedeReservar(reservas, { inicio: "08:00", fin: "13:00" }), false);
  });

  it("rechaza un horario contenido dentro de una reserva", () => {
    assert.equal(puedeReservar(reservas, { inicio: "09:15", fin: "09:45" }), false);
  });

  it("rechaza un intervalo invalido", () => {
    assert.equal(puedeReservar(reservas, { inicio: "15:00", fin: "14:00" }), false);
  });

  it("rechaza un intervalo con inicio y termino iguales", () => {
    assert.equal(puedeReservar(reservas, { inicio: "14:00", fin: "14:00" }), false);
  });
});

describe("validarReserva", () => {
  it("informa que no hay impedimento cuando el horario esta disponible", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "14:00", fin: "15:00" }), {
      permitido: true,
    });
  });

  it("identifica el solapamiento parcial y la reserva en conflicto", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "09:30", fin: "10:30" }), {
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "PARCIAL",
        reserva: { inicio: "09:00", fin: "10:00" },
      },
    });
  });

  it("identifica un horario contenido dentro de otro", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "11:15", fin: "11:45" }), {
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "CONTENIDO",
        reserva: { inicio: "11:00", fin: "12:00" },
      },
    });
  });

  it("identifica un solapamiento completo", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "08:00", fin: "10:30" }), {
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "COMPLETO",
        reserva: { inicio: "09:00", fin: "10:00" },
      },
    });
  });

  it("trata una reserva identica a una existente como solapamiento completo", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "09:00", fin: "10:00" }), {
      permitido: false,
      rechazo: {
        tipo: "SOLAPAMIENTO",
        conflicto: "COMPLETO",
        reserva: { inicio: "09:00", fin: "10:00" },
      },
    });
  });

  it("informa el motivo cuando el intervalo solicitado es invalido", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "15:00", fin: "14:00" }), {
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "INTERVALO_INVALIDO" },
    });
  });

  it("informa el motivo cuando el inicio y el termino son iguales", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "14:00", fin: "14:00" }), {
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "DURACION_CERO" },
    });
  });

  it("informa el motivo cuando el horario solicitado tiene formato invalido", () => {
    assert.deepEqual(validarReserva(reservas, { inicio: "9:00", fin: "10:00" }), {
      permitido: false,
      rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "FORMATO_INVALIDO" },
    });
  });

  it("rechaza la solicitud si la agenda contiene un horario ilegible", () => {
    const agendaCorrupta: readonly Reserva[] = [{ inicio: "99:99", fin: "10:00" }];

    assert.deepEqual(
      validarReserva(agendaCorrupta, { inicio: "14:00", fin: "15:00" }),
      {
        permitido: false,
        rechazo: {
          tipo: "AGENDA_INVALIDA",
          motivo: "FORMATO_INVALIDO",
          reserva: { inicio: "99:99", fin: "10:00" },
        },
      },
    );
  });

  it("valida la solicitud antes que la agenda", () => {
    const agendaCorrupta: readonly Reserva[] = [{ inicio: "99:99", fin: "10:00" }];

    assert.deepEqual(
      validarReserva(agendaCorrupta, { inicio: "15:00", fin: "14:00" }),
      {
        permitido: false,
        rechazo: { tipo: "SOLICITUD_INVALIDA", motivo: "INTERVALO_INVALIDO" },
      },
    );
  });
});
