# Requirements

## v1 Requirements

### Authentication & Profiles (AUTH)
- [ ] **AUTH-01**: La app se puede usar sin crear una cuenta (fricción cero).
- [ ] **AUTH-02**: Usuario puede configurar un alias, su fecha de nacimiento y ciclo para la programación de recordatorios.

### Core Experience (UX)
- [ ] **CORE-01**: Interfaz primaria con estética de Lock Screen (9 nodos conectables).
- [ ] **CORE-02**: La pantalla principal debe verse similar a las imágenes provistas (color rosa claro de fondo, puntos translúcidos y botón de "aprender patrón").

### Educational Engine (EDU)
- [ ] **EDU-01**: Sistema rastrea el gesto del usuario sobre el canvas de 9 puntos en tiempo real.
- [ ] **EDU-02**: El sistema despliega un patrón animado a seguir (ej: Radial, Espiral o Vertical).
- [ ] **EDU-03**: Validación estricta del orden: el trazo del usuario debe coincidir con el orden educativo de puntos.
- [ ] **EDU-04**: El sistema emite feedback de vibración (haptics) al pasar por cada nodo correcto.
- [ ] **EDU-05**: El sistema emite feedback visual (glow/glow en rojo) al terminar correcta/incorrectamente.

### Reminders (REM)
- [ ] **REM-01**: La app puede agendar notificaciones locales mensuales para recordar el autoexamen.

## v2 Requirements (Deferred)
- Gamificación (rachas, "streak" de meses consecutivos).
- Integración con HealthKit / Google Fit.

## Out of Scope
- Reemplazo real del Lock Screen nativo de dispositivos OS. Se implementará como App independiente.
- Funciones de telediagnóstico (No es una app médica).

## Traceability
*(To be populated by Roadmap)*
