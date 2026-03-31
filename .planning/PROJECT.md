# Unlock Health

## Context

**What This Is:**  
Unlock Health es una App móvil educativa (Android, iOS) con estética de pantalla de bloqueo ("Pattern Lock") que enseña los movimientos del autoexamen de seno. 

**The Problem:**  
El cáncer de mama es una de las principales causas de muerte en mujeres por falta de educación preventiva. Además, las usuarias sufren de fatiga de aplicaciones: no quieren otra app médica compleja ni otro calendario menstrual.

**Core Value & Hook (Opción B: Impacto Social en "Octubre Rosa"):**  
"Aprende el patrón y salva dos vidas". La aplicación se basa en el micro-voluntariado como una campaña **"One-Shot" exclusiva del mes de Octubre**. Las usuarias trazan el patrón en su celular 1 vez al día durante este mes rosa. Si lo hacen correctamente, una marca patrocinadora (diferente por día) dona $0.05 a la fundación Fundayuda. Todo es local, sin fricciones ni rastreo médico.

**Key Constraints & Realities:**  
- **OS Limits:** Modificar el Lock Screen real del teléfono es inviable. La app es standalone.
- **Octubre-only & Anti-Bot:** El sistema y la campaña de donación viven y mueren en Octubre. Se limitará a 1 donación ("desbloqueo solidario") por día, por dispositivo (usando Device ID nativo).

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] REQ-UI-01: Interfaz primaria con estética de Lock Screen (9 nodos conectables) con el branding de Fundayuda.
- [ ] REQ-EDU-01: Sistema rastrea 3 patrones educativos principales (espiral, radial, vertical).
- [ ] REQ-DON-01: Día a día en Octubre, se muestra un Brand Takeover (Ej: "Logrado. Patrocinador X dona 5 centavos.").
- [ ] REQ-SEC-01: Límite anti-bot: 1 donación por día, por device.
- [ ] REQ-REM-01: Notificaciones diarias recordando "Desbloquea una donación hoy" exclusivamente durante el mes rosa.

### Out of Scope

- Seguimiento del ciclo menstrual médico / Fertilidad.
- Alteración de la pantalla de bloqueo (Hardware lock) de iOS/Android.

---
*Last updated: 2026-03-30 after pivot to Social Impact / Sponsored.*
