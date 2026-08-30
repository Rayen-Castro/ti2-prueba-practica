# Actividad 4 — Validador de disponibilidad

**Lógica de negocio / Dominio**

## Objetivo

Desarrollar lógica de negocio pura, en TypeScript y sin frameworks, que determine
si un horario nuevo puede reservarse dado un conjunto de reservas ya existentes.

La función principal expuesta es:

```ts
puedeReservar(reservas: Reserva[], nueva: Reserva): boolean
```

## Tecnologías utilizadas

- TypeScript.
- Vitest (únicamente como runner de pruebas unitarias; no se usa ningún
  framework de UI ni de backend).

## Arquitectura

Este módulo sigue una **arquitectura por capas**, separando las reglas de
negocio puras de la orquestación del caso de uso:

```text
domain/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── domain/
│   │   ├── Intervalo.ts        # Value object: representa un rango horario
│   │   │                       #   - parsea/valida el formato HH:mm
│   │   │                       #   - valida que inicio < fin (intervalo válido)
│   │   └── solapamiento.ts     # Regla de negocio pura: hayOverlap(a, b)
│   │                           #   detecta solapamiento parcial, completo,
│   │                           #   contenido y bordes iguales
│   ├── application/
│   │   └── puedeReservar.ts    # Caso de uso: recorre las reservas existentes
│   │                           #   aplicando las reglas del dominio
│   └── index.ts                # Punto de entrada público del paquete
└── tests/
    ├── intervalo.test.ts       # Pruebas de la capa de dominio (validación)
    └── puedeReservar.test.ts   # Pruebas del caso de uso (integración de reglas)
```

- **Capa de dominio** (`src/domain`): entidades/value objects y reglas de
  negocio puras, sin dependencias externas ni conocimiento del caso de uso.
- **Capa de aplicación** (`src/application`): orquesta las reglas del dominio
  para resolver la pregunta de negocio (`puedeReservar`).
- **tests/**: pruebas unitarias por capa.

## Cómo instalar

```bash
cd domain
npm install
```

## Cómo ejecutar

Este paquete no tiene interfaz de ejecución: es lógica de negocio pura, pensada
para ser consumida por otra capa o verificada mediante sus pruebas. Para
comprobar que todo el código compila y respeta los tipos:

```bash
npm run typecheck
```

## Cómo ejecutar las pruebas

```bash
npm test
```

## Casos cubiertos por las pruebas

- horario disponible (sin solapamiento);
- solapamiento parcial;
- solapamiento completo;
- horario contenido dentro de otro;
- intervalo inválido (inicio posterior al fin);
- inicio y término iguales (intervalo de duración cero).

## No utiliza

- React.
- Convex.
- Better Auth.
- Base de datos.

## Funcionalidades completadas

- [ ] Value object `Intervalo` con validación de formato y de rango.
- [ ] Regla de solapamiento (`hayOverlap`) cubriendo los 6 casos exigidos.
- [ ] Caso de uso `puedeReservar`.
- [ ] Pruebas unitarias para los casos principales.

> En progreso: esta sección se irá marcando a medida que se implemente cada
> parte.

## Funcionalidades pendientes

- Ninguna identificada fuera del alcance mínimo de la actividad.
