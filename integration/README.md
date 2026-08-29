# Actividad 5 — Formulario de reserva con API simulada

## Objetivo

Interfaz que consume un servicio simulado (incluido en el propio proyecto) para:
listar horarios disponibles, seleccionar uno y confirmar una reserva, manejando
los estados de carga, éxito y error.

No depende de ningún backend real ni de otras carpetas del repositorio.

## Tecnologías utilizadas

- TypeScript
- React 19
- Vite
- Vitest (pruebas unitarias del servicio simulado)

## Arquitectura

```
Interfaz (App.tsx, componentes)
        ↓
Servicio (services/reservationService.ts)
        ↓
Respuesta (types.ts: Slot, Reservation, ReservationApiError)
```

La interfaz nunca accede directamente a los datos: siempre pasa por las
funciones `getAvailableSlots()` y `createReservation()` del servicio, que
simulan latencia de red (`setTimeout`) y devuelven o lanzan los tipos
definidos en `types.ts`. Esto permite reemplazar el servicio por llamadas
`fetch()` reales en el futuro sin tocar la interfaz.

## Cómo instalar

```bash
npm install
```

## Cómo ejecutar

```bash
npm run dev
```

Luego abrir la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Cómo ejecutar las pruebas

```bash
npm run test
```

Las pruebas cubren el servicio simulado: listar horarios disponibles, crear
una reserva válida, impedir doble reserva del mismo horario, y validar
errores (nombre vacío, horario inexistente).

## Funcionalidades completadas

- Carga de horarios disponibles con estado de carga (`loading`).
- Listado de horarios y selección de uno.
- Formulario para ingresar el nombre del paciente.
- Confirmación de la reserva contra el servicio simulado.
- Mensaje de éxito al confirmar.
- Manejo de errores: falla de red simulada al cargar horarios, horario ya
  reservado, horario inexistente y nombre vacío, con botón de reintento.
- Estado vacío cuando no quedan horarios disponibles.
- Pruebas unitarias del servicio.

## Funcionalidades pendientes

- No se agregó persistencia real (los datos viven en memoria y se reinician
  al recargar la página), ya que está fuera del alcance de esta actividad.
- No se implementó paginación ni filtros adicionales sobre los horarios.
