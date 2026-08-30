import { describe, expect, it } from "vitest";

import { crearIntervalo, parsearHora } from "../../src/domain/Intervalo";

describe("parsearHora", () => {
  it("convierte una hora valida a minutos desde medianoche", () => {
    expect(parsearHora("00:00")).toBe(0);
    expect(parsearHora("09:30")).toBe(570);
    expect(parsearHora("23:59")).toBe(1439);
  });

  it("rechaza horas fuera del rango de un dia", () => {
    expect(parsearHora("24:00")).toBeNull();
    expect(parsearHora("09:60")).toBeNull();
  });

  it("rechaza formatos que no sean HH:mm", () => {
    expect(parsearHora("9:00")).toBeNull();
    expect(parsearHora("09:00:00")).toBeNull();
    expect(parsearHora(" 09:00")).toBeNull();
    expect(parsearHora("manana")).toBeNull();
    expect(parsearHora("")).toBeNull();
  });
});

describe("crearIntervalo", () => {
  it("construye el intervalo cuando el rango es valido", () => {
    expect(crearIntervalo({ inicio: "09:00", fin: "10:30" })).toEqual({
      valido: true,
      intervalo: { inicioEnMinutos: 540, finEnMinutos: 630 },
    });
  });

  it("rechaza un intervalo con inicio y termino iguales", () => {
    expect(crearIntervalo({ inicio: "09:00", fin: "09:00" })).toEqual({
      valido: false,
      motivo: "DURACION_CERO",
    });
  });

  it("rechaza un intervalo invertido", () => {
    expect(crearIntervalo({ inicio: "12:00", fin: "11:00" })).toEqual({
      valido: false,
      motivo: "INTERVALO_INVALIDO",
    });
  });

  it("rechaza un intervalo con formato invalido en cualquiera de sus extremos", () => {
    expect(crearIntervalo({ inicio: "99:99", fin: "10:00" })).toEqual({
      valido: false,
      motivo: "FORMATO_INVALIDO",
    });
    expect(crearIntervalo({ inicio: "09:00", fin: "10-00" })).toEqual({
      valido: false,
      motivo: "FORMATO_INVALIDO",
    });
  });

  it("prioriza el formato invalido por sobre el resto de las validaciones", () => {
    expect(crearIntervalo({ inicio: "abc", fin: "abc" })).toEqual({
      valido: false,
      motivo: "FORMATO_INVALIDO",
    });
  });
});
