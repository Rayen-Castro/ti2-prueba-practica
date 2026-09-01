objetivo:
Diseñar un pequeño modelo de datos para profesionales y reservas de atención

tecnologías:
typescript
convex

instalación:
usar el siguiente comando en la terminal:
npm install

ejecución:
usar el siguiente comando en la terminal:
npx convex dev

funcionalidades completas:
- los modelos presentan appointments y professional
- Una atención guarda:
    - profesional, fecha, hora de inicio, hora de término
- se implementaron las operaciones:
    - crear una reserva
    - consultar las reservas de un profesional
    - impedir dos reservas que se superpongan para el mismo profesional

funcionalidades faltantes:
- forma para ejecutar pruebas