## Objetivo

Implementar reglas de autorización sobre recursos ficticios (atenciones/appointments),
distinguiendo claramente entre autenticación (¿quién eres?) y autorización
(¿tienes permiso para hacer esto?).

Reglas implementadas:
- Un **student** puede consultar únicamente sus propias atenciones.
- Un **professional** puede consultar únicamente las atenciones que tiene asignadas.

## Tecnologías


- TypeScript
- Better Auth (configuración mínima, con SQLite como almacenamiento)
- better-sqlite3
- Vitest (pruebas unitarias)

# Instalación

Desde la carpeta `security/`:

- npm install

Si es la primera vez que se levanta el proyecto se debe generar y aplicar el esquema de Better Auth:

- npx @better-auth/cli generate
- npx @better-auth/cli migrate

## Cómo ejecutar
 
Este proyecto no expone un servidor HTTP; la lógica de autorización se prueba de forma directa
a través de la función `checkAccess(userId, appointmentId)` ubicada en `src/checkAccess.ts`.

Ejemplo de uso (puedes probarlo con `npx tsx src/ejemplo.ts` si creas un pequeño script):

```ts
import { checkAccess } from "./src/checkAccess";

console.log(checkAccess("u1", "a1")); // { allowed: true }
console.log(checkAccess("u2", "a1")); // { allowed: false, reason: "forbidden" }
```

## Cómo ejecutar las pruebas

- npm test

Esto corre 4 pruebas unitarias sobre `checkAccess`, cubriendo:
- Student viendo su propia atención (permitido).
- Student viendo la atención de otro (denegado).
- Professional viendo una atención asignada (permitido).
- Professional viendo una atención no asignada (denegado).


## Estructura del proyecto


security/
├── src/
│   ├── auth.ts          # Configuración mínima de Better Auth (SQLite)
│   ├── data.ts           # Usuarios y atenciones ficticias en memoria
│   ├── authorize.ts       # Lógica pura de autorización (canViewAppointment)
│   └── checkAccess.ts     # Capa de "respuesta de acceso" (permitido/denegado)
├── tests/
│   └── authorize.test.ts  # Pruebas unitarias
├── security.db            # Base de datos local (SQLite, generada por Better Auth)
└── README.md

## Funcionalidades completadas

- Identificación básica de usuarios ficticios (id, nombre, rol).
- Lógica de autorización separada de la infraestructura de auth (fácil de testear).
- Respuesta clara de acceso permitido / denegado, con motivo de rechazo.
- Pruebas unitarias para los casos de permiso y denegación, para ambos roles.
- Configuración mínima de Better Auth con SQLite, sin dependencias externas ni OAuth.

## Funcionalidades pendientes / simplificadas

- No se implementó un flujo de login real (sign-in/sign-up) ni sesiones HTTP reales:
  `checkAccess` recibe el `userId` directamente en lugar de extraerlo de una sesión
  autenticada por Better Auth. priorizé el tiempo en la lógica de
  autorización.
- No hay endpoints HTTP expuestos (porque no creé un servidor); la validación se prueba
  de forma directa mediante funciones y tests.