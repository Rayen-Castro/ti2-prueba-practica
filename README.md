# Prueba práctica TI2 — Tecnologías y flujo de trabajo

## 1. Objetivo

Esta actividad tiene como objetivo evaluar de forma práctica las fortalezas técnicas de los integrantes de **Taller de Integración II** en distintas áreas del proyecto.

La prueba estará compuesta por **6 actividades independientes**, cada una centrada en un área distinta del desarrollo:

- Frontend Web.
- Backend.
- Base de datos.
- Lógica de negocio / Dominio.
- Integración.
- Autenticación y seguridad.

Cada integrante deberá seleccionar **una actividad distinta**. La selección debe realizarse **entre ustedes antes de comenzar**, procurando que no se repitan actividades.

---

## 2.Uso de github

Deben trabajar de la manera declarada en el repositorio de Cereti docs/tutoriales-ti2/git.pdf:

- creación y uso de la rama;
- desarrollo;
- pruebas básicas;
- commits;
- push de la rama;
- creación del Pull Request;
- revision y aprobacion por al menos 1 usuario.
- Merge y Squash.

La configuración inicial del repositorio debe estar preparada previamente por la Scrum Master para evitar que el tiempo se pierda instalando o creando infraestructura común.

---

## 3. Repositorio

La **Scrum Master deberá crear un único repositorio de GitHub** para toda la actividad.

Todos los integrantes trabajarán dentro de ese mismo repositorio.

El repositorio deberá contener una carpeta independiente para cada prueba:

```text
ti2-prueba-practica/
│
├── frontend/
├── backend/
├── database/
├── domain/
├── integration/
├── security/
│
├── README.md
└── .gitignore
```

Cada carpeta representa un proyecto independiente.

# 4. Selección de actividades

Antes de comenzar la prueba, los integrantes deberán seleccionar entre ustedes una de las seis actividades disponibles.

### Reglas

1. Cada integrante selecciona **una sola actividad**.
2. Cada actividad puede ser realizada por **una sola persona**.
3. No se pueden repetir actividades.
4. Cada integrante trabaja únicamente en la carpeta correspondiente a su actividad.

---

# 5. Actividades a realizar

## Actividad 1 — Panel de atenciones

**Frontend Web**

### Tecnologías principales

- TypeScript.
- React.
- Vite.
- TanStack Router.

### Objetivo

Desarrollar una pequeña aplicación web que permita visualizar atenciones ficticias.

Los datos deberán encontrarse localmente dentro del proyecto. No debe existir dependencia con un backend.

### Requisitos mínimos

La aplicación debe:

- mostrar un listado de atenciones;
- mostrar al menos:
  - nombre ficticio;
  - fecha;
  - hora;
  - estado;
- permitir filtrar las atenciones por estado;
- permitir seleccionar una atención;
- utilizar una ruta dinámica similar a:

```text
/atenciones/:id
```

- mostrar el detalle de la atención seleccionada;
- mostrar correctamente un estado vacío cuando no existan resultados;
- utilizar tipos TypeScript;
- dividir razonablemente la interfaz en componentes.

### Datos

Los datos pueden almacenarse, por ejemplo, en:

```text
src/data/mockData.ts
```

### No debe utilizar

- Convex.
- Better Auth.
- Código de otra actividad.

---

## Actividad 2 — Gestor de solicitudes

**Backend**

### Tecnologías principales

- TypeScript.
- Convex.

### Objetivo

Desarrollar un pequeño backend independiente para administrar solicitudes ficticias.

### Requisitos mínimos

Debe permitir:

- crear una solicitud;
- listar solicitudes;
- consultar una solicitud;
- cambiar el estado de una solicitud.

Estados sugeridos:

```text
recibida
en_revision
aceptada
cerrada
```

Debe impedir al menos una transición inválida.

Ejemplo:

```text
cerrada -> en_revision
```

Las funciones públicas de Convex deben mantenerse pequeñas y la lógica principal debe encontrarse separada cuando corresponda.

### No debe utilizar

- React.
- Código del proyecto de base de datos.
- Código de otra actividad.

---

## Actividad 3 — Agenda de profesionales

**Base de datos y persistencia**

### Tecnologías principales

- TypeScript.
- Convex.

### Objetivo

Diseñar un pequeño modelo de datos para profesionales y reservas de atención.

### Requisitos mínimos

El modelo debe representar al menos:

```text
professional
appointment
```

Una atención deberá guardar como mínimo:

- profesional;
- fecha;
- hora de inicio;
- hora de término.

Debe implementarse una operación que permita:

- crear una reserva;
- consultar las reservas de un profesional;
- impedir dos reservas que se superpongan para el mismo profesional.

Debe agregarse al menos un índice útil para consultar las atenciones.

### No debe utilizar

- Frontend.
- El backend desarrollado en otra actividad.
- Código de otra carpeta.

---

## Actividad 4 — Validador de disponibilidad

**Lógica de negocio / Dominio**

### Tecnologías principales

- TypeScript.

### Objetivo

Desarrollar lógica de negocio pura que determine si un horario puede reservarse.

Esta actividad no debe utilizar frameworks.

### Ejemplo de entrada

```ts
const reservas = [
  { inicio: "09:00", fin: "10:00" },
  { inicio: "11:00", fin: "12:00" },
];
```

El sistema deberá poder determinar si una nueva reserva puede realizarse.

### Requisitos mínimos

Debe detectar:

- horario disponible;
- solapamiento parcial;
- solapamiento completo;
- horario contenido dentro de otro;
- intervalo inválido;
- inicio y término iguales.

Ejemplo:

```ts
puedeReservar(reservas, {
  inicio: "09:30",
  fin: "10:30",
});
```

Resultado esperado:

```text
false
```

Debe incluir pruebas unitarias para los casos principales.

### No debe utilizar

- React.
- Convex.
- Better Auth.
- Base de datos.

---

## Actividad 5 — Formulario de reserva con API simulada

### Área evaluada

**Integración de frontend y servicios**

### Tecnologías principales

- TypeScript.
- React.
- Vite.

### Objetivo

Crear una pequeña interfaz que consuma un servicio simulado incluido dentro de su propio proyecto.

No deberá consumir ningún backend desarrollado por otro integrante.

### Requisitos mínimos

La aplicación debe:

1. cargar horarios disponibles;
2. mostrar un estado de carga;
3. mostrar los horarios disponibles;
4. permitir seleccionar uno;
5. ejecutar una reserva;
6. mostrar un mensaje de éxito;
7. manejar un posible error.

El servicio puede simular una API mediante funciones asíncronas.

Ejemplo:

```ts
getAvailableSlots();
createReservation();
```

Puede utilizarse un pequeño retraso artificial:

```ts
await new Promise((resolve) => setTimeout(resolve, 500));
```

### Se evaluará especialmente

La separación entre:

```text
Interfaz
↓
Servicio
↓
Respuesta
```

### No debe utilizar

- Backend de otra actividad.
- Base de datos de otra actividad.

---

## Actividad 6 — Control de acceso a recursos

### Área evaluada

**Autenticación, autorización y seguridad**

### Tecnologías principales

- TypeScript.
- Better Auth o una configuración mínima previamente preparada para la actividad.

### Objetivo

Implementar reglas de autorización sobre recursos ficticios.

La infraestructura necesaria para iniciar la actividad deberá estar preparada previamente, de manera que el objetivo de la prueba sea implementar las reglas de acceso y no perder tiempo configurando OAuth o servicios externos.

### Escenario

Existirán usuarios ficticios con roles como:

```text
student
professional
```

Y recursos similares a:

```text
appointment
```

### Reglas mínimas

Un estudiante:

- puede consultar sus propias atenciones;
- no puede consultar las atenciones de otro estudiante.

Un profesional:

- puede consultar las atenciones que tenga asignadas;
- no puede consultar atenciones que no tenga asignadas.

### Requisitos mínimos

Implementar:

- identificación del usuario;
- validación del acceso;
- respuesta de acceso permitido;
- respuesta de acceso denegado;
- pruebas para ambos casos.

### Importante

La actividad debe evaluar **autorización**, no solamente autenticación.

Autenticación responde:

```text
¿Quién eres?
```

Autorización responde:

```text
¿Tienes permiso para realizar esta acción?
```

---

### 7. Reglas generales

Durante la prueba se deberán cumplir las siguientes reglas:

1. El repositorio es creado por la Scrum Master.
2. Todos trabajan dentro del mismo repositorio.
3. Cada integrante utiliza su propia rama.
4. Cada integrante selecciona una actividad diferente.
5. Las actividades se seleccionan entre los integrantes antes de comenzar.
6. Cada actividad debe ser completamente independiente.
7. Nadie debe depender del trabajo de otra persona.
8. Cada integrante modifica solamente su carpeta.
9. El tiempo máximo es de 2 horas.
10. Todos los datos utilizados deben ser ficticios.
11. Se debe utilizar Git durante el desarrollo.
12. Todo cambio debe llegar a `main` mediante Pull Request.
13. Otra persona debe revisar el Pull Request.
14. Los problemas detectados en una revisión deben ser corregidos por el autor en su propia rama.
15. Después de la revisión se realiza el merge a `main`.
16. Las ramas utilizadas no deben eliminarse.
17. Si una funcionalidad queda incompleta, debe indicarse claramente en el Pull Request.
18. Se evaluará tanto el resultado como la forma de trabajar.

---

# 8. Entrega mínima por actividad

Cada carpeta deberá contener como mínimo:

```text
actividad/
├── README.md
├── código fuente
└── archivos necesarios para ejecutar la actividad
```

Cuando corresponda, también deberá contener:

```text
tests/
```

o archivos de pruebas equivalentes.

El `README.md` de cada actividad deberá explicar:

- objetivo;
- tecnologías utilizadas;
- cómo instalar;
- cómo ejecutar;
- cómo ejecutar las pruebas, si existen;
- funcionalidades completadas;
- funcionalidades pendientes.

# 10. Resultado esperado

Al finalizar la actividad, el repositorio deberá contener las seis soluciones integradas en `main`:

```text
main
│
├── frontend/
├── backend/
├── database/
├── domain/
├── integration/
└── security/
```

Además, deberán mantenerse disponibles las seis ramas utilizadas y sus respectivos Pull Requests.

El objetivo final no es que las seis soluciones formen una sola aplicación.

El objetivo es que cada solución permita observar de manera independiente las fortalezas técnicas de cada integrante en distintas áreas relevantes para el desarrollo del proyecto.

---
