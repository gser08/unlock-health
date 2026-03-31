# Roadmap: Unlock Health

## Phases & Deliverables

| # | Phase | Goal | Requirements | Criteria |
|---|-------|------|--------------|----------|
| 1 | **Foundation & UI Shell** | Configurar el proyecto Expo/React Native y armar la UI básica con colores/sombras según los bocetos de Fundayuda. | CORE-01, CORE-02 | 3 |
| 2 | **Pattern Component Core** | Implementar la lógica del Canvas de 9 puntos (gestos en pantalla) con validación médica (Círculos, Líneas). | EDU-01, EDU-02, EDU-03 | 4 |
| 3 | **Brand Takeover & Donaciones** | Integrar las pantallas heroicas de éxito patrocinadas y enforzar el Límite Anti-Bot localmente (Device ID). | DON-01, DON-02, DON-03 | 3 |
| 4 | **Reminders System** | Implementar Push Notifications locales agendadas 1x al mes (cero data médica guardada en backend). | REM-01 | 2 |

---

## Phase Details

### Phase 1: Foundation & UI Shell
**Goal**: Tener la App corriendo en simulador/dispositivo con el theme rosado estético ("Fundayuda" branding).
**Requirements**: CORE-01, CORE-02
**Success criteria**:
1. App renderiza un layout placeholder para el lock screen.
2. Los assets (colores `#F494B7` aprox) están configurados en theme base.
3. Se despliega una vista en iOS y Android idéntica y responsive.
**UI hint**: yes

### Phase 2: Pattern Component Core
**Goal**: Motor de "Pattern Lock" que detecte trazos de dedo cruzando nodos con feedback positivo.
**Requirements**: EDU-01, EDU-02, EDU-03
**Success criteria**:
1. Al tocar o pasar sobre uno de los 9 nodos predefinidos, la línea se une (snap).
2. Vibración suave al "snap" (haptic feedback).
3. Lógica rígida para evaluar contra un patrón correcto y emitir error/color verde (brillo blanquecino según tu mockup).
**UI hint**: yes

### Phase 3: Brand Takeover & Donaciones
**Goal**: Flujo principal. Alguien dibuja bien y la fundación celebra junto a la marca.
**Requirements**: DON-01, DON-02, DON-03
**Success criteria**:
1. Pantalla de celebración "Has completado tu revisión. Marca X dona 5¢".
2. Se usa `expo-application` o `expo-device` para obtener Android ID / IdentifierForVendor.
3. El conteo de intentos se congela para que los bots/grinders no hagan 10k donaciones falsas. Si se vuelve a intentar ese mes, sale el mensaje: "¡Sigues mejorando! Tu donación mensual ya fue registrada, vuelve el mes que viene".
**UI hint**: yes

### Phase 4: Reminders System
**Goal**: El trigger asíncrono.
**Requirements**: REM-01
**Success criteria**:
1. Permisos de notificaciones habilitados y agendados dentro de 30 días post-primer intento.
**UI hint**: no
