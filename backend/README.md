Aquí tienes el contenido completo para copiar y pegar directamente en tu archivo `README.md` dentro de la carpeta `backend`:

```markdown
# Actividad 2 — Gestor de solicitudes

## Objetivo

Desarrollar un backend independiente para administrar solicitudes ficticias utilizando Convex y TypeScript, separando la lógica pura del dominio y garantizando el control estricto en las transiciones de estado.

Reglas de negocio implementadas:
- Las solicitudes se crean en estado inicial `recibida`.
- Matriz de transiciones válidas:
  - `recibida` -> `en_revision` | `cerrada`
  - `en_revision` -> `aceptada` | `cerrada`
  - `aceptada` -> `cerrada`
  - `cerrada` -> (ninguna, es estado terminal)
- Se impide explícitamente cualquier transición inválida (ejemplo: `cerrada` -> `en_revision`).

## Tecnologías

- TypeScript
- Convex

## Instalación

Desde la carpeta `backend/`:

```bash
npm install

```

## Cómo ejecutar

Iniciar el entorno local de Convex:

```bash
npx convex dev

```

Este comando sincronizará automáticamente el esquema (`schema.ts`) y las funciones del backend con tu despliegue de desarrollo en Convex.

## Cómo probar las funciones

Puedes interactuar con el backend directamente desde el **Convex Dashboard** (la URL interactiva que entrega la consola al ejecutar `npx convex dev`).

Ejemplos de funciones disponibles:

* **`solicitudes:crear`** (mutation): Crea una solicitud en estado `recibida`.
```json
{ "titulo": "Nueva solicitud", "descripcion": "Detalles del requerimiento" }

```


* **`solicitudes:listar`** (query): Retorna la lista completa de solicitudes.
* **`solicitudes:obtenerPorId`** (query): Retorna la solicitud coincidente con el `id`.
```json
{ "id": "<ID_DE_LA_SOLICITUD>" }

```


* **`solicitudes:cambiarEstado`** (mutation): Modifica el estado de la solicitud validando las reglas de negocio.
```json
{ "id": "<ID_DE_LA_SOLICITUD>", "nuevoEstado": "en_revision" }

```



*Prueba de transición inválida:* Intentar cambiar una solicitud de `cerrada` a `en_revision` lanzará un error de validación e impedirá el cambio en la base de datos.

## Estructura del proyecto

```text
backend/
├── convex/
│   ├── schema.ts           # Definición de tablas y validadores de datos de Convex
│   ├── solicitudesLogic.ts # Lógica pura de dominio (matriz y validación de estados)
│   └── solicitudes.ts      # API pública de Convex (queries y mutations)
├── package.json
└── README.md

```

## Funcionalidades completadas

* Creación de solicitudes con estado por defecto `recibida`.
* Consulta general (listar) y consulta específica por `id`.
* Modificación de estados mediante mutaciones públicas.
* Validación de reglas de dominio desacoplada en `solicitudesLogic.ts`.
* Control estricto para evitar transiciones de estado inválidas.

## Funcionalidades pendientes / simplificadas

* No se incluyó una interfaz gráfica ni React (por restricción explícita de la actividad).
* La validación y prueba de la API se realiza directamente mediante el Dashboard interactivo de Convex.

```

```