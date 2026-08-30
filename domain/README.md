# Actividad 4 — Validador de disponibilidad

**Lógica de negocio / Dominio**

## Objetivo

Determinar si un horario nuevo puede reservarse dado un conjunto de reservas ya
existentes, mediante lógica de negocio pura escrita en TypeScript y sin
frameworks.

La función principal es:

```ts
puedeReservar(reservas: readonly Reserva[], nueva: Reserva): boolean;
```

Ejemplo del enunciado:

```ts
const reservas = [
  { inicio: "09:00", fin: "10:00" },
  { inicio: "11:00", fin: "12:00" },
];

puedeReservar(reservas, { inicio: "09:30", fin: "10:30" }); // false
```

## Tecnologías utilizadas

- **TypeScript** en modo `strict`, usado solo como verificador de tipos: el
  módulo nunca se compila a JavaScript porque no se ejecuta por sí mismo.
- **`node --test`**, el ejecutor de pruebas nativo de Node. No se utiliza ningún
  framework de testing.
- **`@types/node`**, definiciones de tipos para las pruebas.

El módulo **no tiene dependencias de ejecución**: es lógica pura.

## Requisitos

Node.js **22.18 o superior**, versión desde la cual Node ejecuta archivos
TypeScript directamente sin necesidad de compilarlos. Probado en **Node
v24.15.0**.

## Arquitectura

El módulo sigue una **arquitectura por capas**, separando las reglas de negocio
de la orquestación del caso de uso:

```text
domain/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── src/
│   ├── domain/
│   │   ├── Intervalo.ts          # Value object: valida "HH:mm" y el rango,
│   │   │                         #   y normaliza a minutos desde medianoche
│   │   └── solapamiento.ts       # Regla de negocio: haySolapamiento() y
│   │                             #   clasificarSolapamiento()
│   ├── application/
│   │   └── puedeReservar.ts      # Caso de uso: recorre la agenda aplicando
│   │                             #   las reglas del dominio
│   └── index.ts                  # API pública del módulo
└── tests/
    ├── domain/
    │   ├── intervalo.test.ts
    │   └── solapamiento.test.ts
    └── application/
        └── puedeReservar.test.ts
```

- **Capa de dominio** (`src/domain`): value objects y reglas puras. No conoce
  listas de reservas ni el caso de uso que las consume.
- **Capa de aplicación** (`src/application`): no define reglas propias; solo
  construye los intervalos y recorre la agenda delegando en el dominio.
- **`src/index.ts`**: define qué es API pública y qué es detalle interno. Todo
  consumidor debería importar desde aquí.

## API pública

| Función | Devuelve | Uso |
|---|---|---|
| `puedeReservar(reservas, nueva)` | `boolean` | Respuesta directa que pide el enunciado. |
| `validarReserva(reservas, nueva)` | `ResultadoValidacion` | Igual que la anterior, pero informando el motivo del rechazo y la reserva en conflicto. |
| `crearIntervalo(reserva)` | `ResultadoIntervalo` | Valida y normaliza un rango horario. |
| `haySolapamiento(a, b)` | `boolean` | Regla base: ¿dos intervalos comparten minutos? |
| `clasificarSolapamiento(nuevo, existente)` | `TipoSolapamiento` | Distingue `PARCIAL`, `CONTENIDO`, `COMPLETO` y `SIN_SOLAPAMIENTO`. |

`validarReserva` existe porque el enunciado exige **detectar** seis situaciones
distintas, y un valor booleano no permite diferenciar un solapamiento parcial de
un intervalo inválido. `puedeReservar` conserva intacta la firma pedida.

## Decisiones de diseño

Estas decisiones no estaban especificadas en el enunciado y se resolvieron de
forma explícita:

1. **Los intervalos son semiabiertos `[inicio, fin)`.** El minuto de inicio
   pertenece al intervalo y el de término no. En consecuencia, una reserva de
   `10:00–11:00` **sí puede agendarse** después de una de `09:00–10:00`: se
   tocan por el borde, pero no se superponen. Es la convención habitual en
   sistemas de agendamiento.

2. **Se valida el formato de la hora, además del rango.** Solo se acepta `HH:mm`
   entre `00:00` y `23:59`. Por lo tanto `"9:00"`, sin el cero a la izquierda, se
   rechaza por formato inválido y no por conflicto de horario.

3. **Una agenda ilegible provoca rechazo, no se ignora.** Si alguna reserva ya
   existente tiene un horario inválido, la solicitud se rechaza con el motivo
   `AGENDA_INVALIDA`. Ante datos que no se pueden interpretar es preferible
   negar el agendamiento antes que afirmar una disponibilidad no verificada.

4. **Los errores se devuelven, no se lanzan.** `crearIntervalo` y
   `validarReserva` retornan uniones discriminadas, de modo que el compilador
   obliga a manejar el caso de error.

5. **Dos rangos idénticos se clasifican como `COMPLETO`.** Cumplen a la vez las
   condiciones de solapamiento completo y contenido; se resuelve por el primero.

## Cómo instalar

```bash
cd domain
npm install
```

## Cómo ejecutar

El módulo es una biblioteca de lógica pura y no tiene interfaz de ejecución. Se
verifica comprobando que todo compile y respete los tipos:

```bash
npm run typecheck
```

## Cómo ejecutar las pruebas

```bash
npm test
```

Modo interactivo, que reejecuta ante cada cambio:

```bash
npm run test:watch
```

Resultado esperado: **38 pruebas, 0 fallos**.

## Casos cubiertos por las pruebas

Los seis casos exigidos por el enunciado:

- horario disponible;
- solapamiento parcial (por ambos extremos);
- solapamiento completo;
- horario contenido dentro de otro;
- intervalo inválido;
- inicio y término iguales.

Y además:

- el ejemplo literal del enunciado (`09:30–10:30` → `false`);
- agenda vacía;
- reservas que se tocan por el borde;
- reserva idéntica a una ya existente;
- formato de hora inválido;
- agenda que contiene un horario ilegible;
- precedencia entre validaciones.

Las reglas del dominio se prueban de forma aislada del parseo de horas, para que
un fallo indique con precisión qué se rompió.

## No utiliza

- React.
- Convex.
- Better Auth.
- Base de datos.
- Frameworks de ningún tipo, incluidos los de testing.

## Funcionalidades completadas

- [x] Value object `Intervalo`: valida formato `HH:mm`, detecta duración cero e
      intervalo invertido, y normaliza a minutos.
- [x] Regla de solapamiento que distingue los tres tipos de choque.
- [x] Caso de uso `puedeReservar` con la firma booleana del enunciado.
- [x] `validarReserva`, que informa el motivo del rechazo y la reserva en
      conflicto.
- [x] API pública definida en `src/index.ts`.
- [x] 38 pruebas unitarias organizadas por capa.
- [x] Verificación de tipos en modo `strict` sin errores.

## Funcionalidades pendientes

Ninguna de las exigidas por el enunciado. Quedan fuera del alcance definido,
y se dejan documentadas por transparencia:

- **No existe la dimensión fecha**: se asume que todas las reservas comparten el
  mismo día, tal como muestra el ejemplo del enunciado.
- **Se informa solo el primer conflicto**: si la reserva nueva choca con varias
  existentes, `validarReserva` reporta únicamente la primera que encuentra.
- **No se normalizan las entradas**: `"9:00"` se rechaza en lugar de
  interpretarse como `"09:00"`.
