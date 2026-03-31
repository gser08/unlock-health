# Unlock Health

## Context

**What This Is:**  
Unlock Health es una App móvil educativa (Android, iOS) que convierte la mecánica de los patrones de bloqueo (puntos unidos por líneas) en una herramienta para enseñar los movimientos del autoexamen de seno. El propósito es prevenir el cáncer de mama al aprovechar una acción cotidiana (trazar un patrón) para interiorizar y educar a las usuarias sobre los diferentes tipos de palpación (circular, radial, vertical).

**The Problem:**  
El cáncer de mama es una de las principales causas de muerte en mujeres, en gran parte debido a la falta de educación sobre cómo y cuándo realizarse el autoexamen para la detección temprana. 

**Core Value:**  
Educación preventiva interactiva, hermosa y memorable: "El mismo patrón que abre tu celular puede salvar tu vida." Las personas agregan una "capa de seguridad extra" a sus vidas.

**Key Constraints & Realities:**  
- **Limitaciones del OS:** Reemplazar genuinamente la pantalla de bloqueo *nativa* del sistema operativo (Lock Screen real) es técnicamente inviable o prohibido tanto en iOS como en las versiones modernas de Android (por motivos de seguridad).
- **Abordaje Pragmático:** La solución más realista y mantenible será una App standalone de uso frecuente, potencialmente apalancada por notificaciones ricas (Rich Notifications), widgets o alarmas mensuales que invitan a la usuaria a "desbloquear" su examen de salud del mes introduciendo un patrón específico. Alternativamente, puede existir un vault privado o diario en la app que requiere este patrón educativo para abrirse.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Usuarios son introducidos al concepto de "patrón de bloqueo como autoexamen" (Onboarding interactivo).
- [ ] La interfaz primaria replica estéticamente la elegancia de una pantalla de bloqueo con 9 puntos (Lock Screen).
- [ ] Soporte para distintos tipos de patrones que enseñan los 3 movimientos principales del autoexamen de mama (espiral, líneas verticales, líneas cuña/radiales).
- [ ] Refuerzo positivo visual y retroalimentación háptica tras trazar el patrón correctamente.
- [ ] Programación o recordatorio mensual inteligente ("Es hora de desbloquear tu seguridad", basado en la fecha ideal del ciclo menstrual).

### Out of Scope

- Reemplazar la pantalla de bloqueo nativa del sistema telefónico (Device Lock Screen) — Restricción técnica de iOS/Android.
- Diagnóstico automatizado de la salud de la usuaria — Es una herramienta educativa, no médica.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Enfoque de App Educativa / Vault Personal** | Los OS Móviles bloquean la alteración de la pantalla de bloqueo. Una app que protege información personal o sirve de diario usando un patrón educativo como "desbloqueo" permite simular la experiencia sin romper las reglas de Apple/Google. | — Pending |
| **Framework Multi-Plataforma** | Para abarcar Android e iOS desde el día 1, se optará por un framework como React Native o Expo. | — Pending |

---
*Last updated: 2026-03-30 after initialization*
