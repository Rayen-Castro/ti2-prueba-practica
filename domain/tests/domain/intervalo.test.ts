import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { crearIntervalo, parsearHora } from "../../src/domain/Intervalo.ts";

describe("parsearHora", () => {
  it("convierte una hora valida a minutos desde medianoche", () => {
    assert.equal(parsearHora("00:00"), 0);
    assert.equal(parsearHora("09:30"), 570);
    assert.equal(parsearHora("23:59"), 1439);
  });

  it("rechaza horas fuera del rango de un dia", () => {
    assert.equal(parsearHora("24:00"), null);
    assert.equal(parsearHora("09:60"), null);
  });

  it("rechaza formatos que no sean HH:mm", () => {
    assert.equal(parsearHora("9:00"), null);
    assert.equal(parsearHora("09:00:00"), null);
    assert.equal(parsearHora(" 09:00"), null);
    assert.equal(parsearHora("manana"), null);
    assert.equal(parsearHora(""), null);
  });
});

describe("crearIntervalo", () => {
  it("construye el intervalo cuando el rango es valido", () => {
    assert.deepEqual(crearIntervalo({ inicio: "09:00", fin: "10:30" }), {
      valido: true,
      intervalo: { inicioEnMinutos: 540, finEnMinutos: 630 },
    });
  });

  it("rechaza un intervalo con inicio y termino iguales", () => {
    assert.deepEqual(crearIntervalo({ inicio: "09:00", fin: "09:00" }), {
      valido: false,
      motivo: "DURACION_CERO",
    });
  });

  it("rechaza un intervalo invertido", () => {
    assert.deepEqual(crearIntervalo({ inicio: "12:00", fin: "11:00" }), {
      valido: false,
      motivo: "INTERVALO_INVALIDO",
    });
  });

  it("rechaza un intervalo con formato invalido en cualquiera de sus extremos", () => {
    assert.deepEqual(crearIntervalo({ inicio: "99:99", fin: "10:00" }), {
      valido: false,
      motivo: "FORMATO_INVALIDO",
    });
    assert.deepEqual(crearIntervalo({ inicio: "09:00", fin: "10-00" }), {
      valido: false,
      motivo: "FORMATO_INVALIDO",
    });
  });

  it("prioriza el formato invalido por sobre el resto de las validaciones", () => {
    assert.deepEqual(crearIntervalo({ inicio: "abc", fin: "abc" }), {
      valido: false,
      motivo: "FORMATO_INVALIDO",
    });
  });
});
