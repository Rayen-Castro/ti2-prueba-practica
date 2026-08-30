import { describe, expect, it } from "vitest";

import type { Intervalo } from "../../src/domain/Intervalo";
import {
  clasificarSolapamiento,
  hayOverlap,
} from "../../src/domain/solapamiento";

const MINUTOS_POR_HORA = 60;

/**
 * Construye un intervalo directamente, sin pasar por crearIntervalo, para que
 * estas pruebas evaluen solo la regla de solapamiento.
 * rango(9, 10.5) representa 09:00-10:30.
 */
const rango = (horaInicio: number, horaFin: number): Intervalo => ({
  inicioEnMinutos: horaInicio * MINUTOS_POR_HORA,
  finEnMinutos: horaFin * MINUTOS_POR_HORA,
});

describe("hayOverlap", () => {
  it("detecta que dos intervalos comparten minutos", () => {
    expect(hayOverlap(rango(9, 10), rango(9.5, 10.5))).toBe(true);
  });

  it("no considera choque a dos intervalos separados", () => {
    expect(hayOverlap(rango(9, 10), rango(11, 12))).toBe(false);
  });

  it("no considera choque a dos intervalos que solo se tocan por el borde", () => {
    expect(hayOverlap(rango(9, 10), rango(10, 11))).toBe(false);
    expect(hayOverlap(rango(10, 11), rango(9, 10))).toBe(false);
  });

  it("es simetrico", () => {
    expect(hayOverlap(rango(9, 11), rango(10, 12))).toBe(
      hayOverlap(rango(10, 12), rango(9, 11)),
    );
  });
});

describe("clasificarSolapamiento", () => {
  const existente = rango(9, 10);

  it("reconoce un horario disponible", () => {
    expect(clasificarSolapamiento(rango(11, 12), existente)).toBe(
      "SIN_SOLAPAMIENTO",
    );
  });

  it("reconoce un horario disponible que empieza justo al terminar el otro", () => {
    expect(clasificarSolapamiento(rango(10, 11), existente)).toBe(
      "SIN_SOLAPAMIENTO",
    );
  });

  it("reconoce un solapamiento parcial por el final del existente", () => {
    expect(clasificarSolapamiento(rango(9.5, 10.5), existente)).toBe("PARCIAL");
  });

  it("reconoce un solapamiento parcial por el inicio del existente", () => {
    expect(clasificarSolapamiento(rango(8.5, 9.5), existente)).toBe("PARCIAL");
  });

  it("reconoce un horario contenido dentro de otro", () => {
    expect(clasificarSolapamiento(rango(9.25, 9.75), existente)).toBe(
      "CONTENIDO",
    );
  });

  it("reconoce un solapamiento completo cuando el nuevo cubre al existente", () => {
    expect(clasificarSolapamiento(rango(8, 11), existente)).toBe("COMPLETO");
  });

  it("clasifica dos horarios identicos como solapamiento completo", () => {
    expect(clasificarSolapamiento(rango(9, 10), existente)).toBe("COMPLETO");
  });
});
