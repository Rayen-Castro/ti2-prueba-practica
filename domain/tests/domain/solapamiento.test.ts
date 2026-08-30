import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Intervalo } from "../../src/domain/Intervalo.ts";
import {
  clasificarSolapamiento,
  hayOverlap,
} from "../../src/domain/solapamiento.ts";

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
    assert.equal(hayOverlap(rango(9, 10), rango(9.5, 10.5)), true);
  });

  it("no considera choque a dos intervalos separados", () => {
    assert.equal(hayOverlap(rango(9, 10), rango(11, 12)), false);
  });

  it("no considera choque a dos intervalos que solo se tocan por el borde", () => {
    assert.equal(hayOverlap(rango(9, 10), rango(10, 11)), false);
    assert.equal(hayOverlap(rango(10, 11), rango(9, 10)), false);
  });

  it("es simetrico", () => {
    assert.equal(
      hayOverlap(rango(9, 11), rango(10, 12)),
      hayOverlap(rango(10, 12), rango(9, 11)),
    );
  });
});

describe("clasificarSolapamiento", () => {
  const existente = rango(9, 10);

  it("reconoce un horario disponible", () => {
    assert.equal(
      clasificarSolapamiento(rango(11, 12), existente),
      "SIN_SOLAPAMIENTO",
    );
  });

  it("reconoce un horario disponible que empieza justo al terminar el otro", () => {
    assert.equal(
      clasificarSolapamiento(rango(10, 11), existente),
      "SIN_SOLAPAMIENTO",
    );
  });

  it("reconoce un solapamiento parcial por el final del existente", () => {
    assert.equal(clasificarSolapamiento(rango(9.5, 10.5), existente), "PARCIAL");
  });

  it("reconoce un solapamiento parcial por el inicio del existente", () => {
    assert.equal(clasificarSolapamiento(rango(8.5, 9.5), existente), "PARCIAL");
  });

  it("reconoce un horario contenido dentro de otro", () => {
    assert.equal(
      clasificarSolapamiento(rango(9.25, 9.75), existente),
      "CONTENIDO",
    );
  });

  it("reconoce un solapamiento completo cuando el nuevo cubre al existente", () => {
    assert.equal(clasificarSolapamiento(rango(8, 11), existente), "COMPLETO");
  });

  it("clasifica dos horarios identicos como solapamiento completo", () => {
    assert.equal(clasificarSolapamiento(rango(9, 10), existente), "COMPLETO");
  });
});
