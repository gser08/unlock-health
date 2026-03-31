# Roadmap: Unlock Health

## Phases & Deliverables

| # | Phase | Goal | Requirements | Criteria |
|---|-------|------|--------------|----------|
| 1 | **Foundation & UI Shell** | Configurar el proyecto Expo/React Native y armar la UI básica con colores/sombras según los bocetos. | CORE-01, CORE-02 | 3 |
| 2 | **Pattern Component Core** | Implementar la lógica del Canvas de 9 puntos (gestos en pantalla) capaz de conectarse sin validación médica. | EDU-01, EDU-04, EDU-05 | 4 |
| 3 | **Educative Patterns API** | Mapear los trazos médicos (Radial, Circular, Vertical) a arrays de coordenadas del canvas 3x3 y hacer la validación paso a paso. | EDU-02, EDU-03 | 2 |
| 4 | **Onboarding & Configuration** | Flujo para configurar alias y la periodicidad del examen mensual, terminando en la pantalla principal. | AUTH-01, AUTH-02 | 3 |
| 5 | **Reminders System** | Implementar Push Notifications locales con expo-notifications agendadas mensualmente. | REM-01 | 2 |

---

## Phase Details

### Phase 1: Foundation & UI Shell
**Goal**: Tener la App corriendo en simulador/dispositivo con el theme rosado estético ("Fundayuda" branding).
**Requirements**: CORE-01, CORE-02
**Success criteria**:
1. App hace un render de un header y un grid placeholder.
2. Los assets (tipografía, colores `#F494B7` aprox) están configurados.
3. Se despliega una vista en iOS y Android idéntica.
**UI hint**: yes

### Phase 2: Pattern Component Core
**Goal**: Motor de "Pattern Lock" que detecte trazos de dedo cruzando nodos.
**Requirements**: EDU-01, EDU-04, EDU-05
**Success criteria**:
1. PanGestureHandler dibuja una línea siguiendo al dedo sobre un SVG o canvas.
2. Al tocar o pasar sobre uno de los 9 nodos predefinidos, la línea hace un 'snap' al punto.
3. El teléfono vibra suavemente al "snap" (haptic feedback).
4. El teléfono muestra una animación luminosa (glow) en caso de éxito/error genérico.
**UI hint**: yes

### Phase 3: Educative Patterns API
**Goal**: Lógica rígida para educar los movimientos contra un patrón correcto ("Secreto").
**Requirements**: EDU-02, EDU-03
**Success criteria**:
1. La UI presenta una animación sutil para mostrar el trazo correcto a realizar (ej: `1 -> 2 -> 3 -> 6 -> 9 -> 8 -> 7 -> 4 -> 5` que sería una espiral o cuña).
2. Si el usuario traza otra cosa, la línea se limpia con un shake rojo. Si se dibuja el patrón, se pone resplandeciente blanco/verde.
**UI hint**: yes

### Phase 4: Onboarding & Configuration
**Goal**: Experiencia para nuevos usuarios que explique la causa preventiva de la App y solicite la configuración del ciclo menstrual.
**Requirements**: AUTH-01, AUTH-02
**Success criteria**:
1. Las pantallas de tutorial narran y presentan la misión "Tu celular guarda un patrón que podría salvar tu vida".
2. Posibilidad opcional de registrar qué fecha suele llegar el periodo.
3. Se guardan las preferencias con `async-storage`.
**UI hint**: no

### Phase 5: Reminders System
**Goal**: Motor de recordatorio mensual.
**Requirements**: REM-01
**Success criteria**:
1. Permisos locales de Push Notification solicitados.
2. Se agenda silenciosamente un "Triger mensual" asumiendo 7-10 días ideal post-menstruación, o recordatorio generico de "Revisión 1 vez al mes" ("Es tu momento UnlockHealth").
**UI hint**: no
