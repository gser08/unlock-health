# Unlock Health

## Context

**What This Is:**  
Unlock Health es una App móvil educativa (Android, iOS) con estética de pantalla de bloqueo ("Pattern Lock") que enseña los movimientos del autoexamen de seno. 

**The Problem:**  
El cáncer de mama es una de las principales causas de muerte en mujeres por falta de educación preventiva. Además, las usuarias sufren de fatiga de aplicaciones: no quieren otra app médica compleja ni otro calendario menstrual.

**Core Value & Hook (Opción B: Impacto Social):**  
"Aprende el patrón y salva dos vidas". La aplicación se basa en el micro-voluntariado. Las usuarias trazan el patrón en su celular 1 vez al mes. Si lo hacen correctamente, interiorizan el autoexamen, y una marca patrocinadora dona $0.05 a la fundación Fundayuda. 
No hay tracking médico, no hay necesidad de ingresar fechas sensibles; es una app higiénica de impacto social directo y cero fricción.

**Key Constraints & Realities:**  
- **OS Limits:** Modificar el Lock Screen real del teléfono es inviable. La app es standalone y se apoya en Push Notifications locales para llamar a la usuaria.
- **Anti-Bot Farming:** Al haber dinero involucrado por patrocinadores (donaciones por patrón), el sistema limitará la "donación desbloqueada" a **1 vez por mes, por dispositivo** (usando Device ID nativo anónimo). Se puede practicar mil veces, pero solo dona una vez.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] REQ-UI-01: Interfaz primaria con estética de Lock Screen (9 nodos conectables) con el branding de Fundayuda.
- [ ] REQ-EDU-01: Sistema rastrea 3 patrones educativos principales (espiral, radial, vertical).
- [ ] REQ-DON-01: Al completar exitosamente el patrón, se muestra el Brand Takeover (Ej: "Logrado. Patrocinador X dona 5 centavos.").
- [ ] REQ-SEC-01: Lógica de Cap Anti-Bot: Permite prácticas infinitas, pero registra la API de donación 1 vez por mes por Device ID / Token.
- [ ] REQ-REM-01: Autoprogramación de un recordatorio inteligente local "Desbloquea una donación hoy" cada 30 días.

### Out of Scope

- Seguimiento del ciclo menstrual médico / Fertilidad.
- Alteración de la pantalla de bloqueo (Hardware lock) de iOS/Android.

---
*Last updated: 2026-03-30 after pivot to Social Impact / Sponsored.*
