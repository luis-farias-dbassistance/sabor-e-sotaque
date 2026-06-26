# Prompt para Antigravity IDE — Sabor & Sotaque v2 / Sprints 3, 4 y 5

---

## Contexto del proyecto

Continuación de la implementación v2 de **Sabor & Sotaque**. Los Sprints 1 y 2 ya están implementados:

- ✅ M14 (Emergencias) y M15 (Rafting & Kayak) creados
- ✅ M11 expandido a 15 lecciones, M10 / M5 / M7 con vocabulario agregado
- ✅ Categoría `"seguridad"` y tab en FlavorMap operativos
- ✅ Pantalla de vocabulario `/lesson/[moduleId]/vocab` funcionando
- ✅ Tipos `Lesson` extendidos con `dialogue_trigger_pt/es`, `speaker_role`, `difficulty`

Stack: Next.js 16 / React 19 / TailwindCSS v4 / AWS (DynamoDB, Polly, Cognito). El componente de evaluación de voz existente es `VoiceAssessor.tsx` (Web Speech API + scoring Levenshtein ≥ 0.85).

**Regla crítica (AGENTS.md):** Cada vez que se modifica `src/lib/lessons.ts` ejecutar:
1. `npx tsx scripts/seed-db.ts`
2. `npm run generate-audio`

---

## SPRINT 3 — Modo Diálogo

### Descripción

El modo diálogo presenta una **frase disparadora** (lo que dice el turista o el interlocutor) y pide al usuario que practique la **respuesta correcta en pt-BR**. Es una variante de la lección estándar que agrega contexto conversacional real.

Solo activa cuando la lección tiene `dialogue_trigger_pt` definido.

---

### Paso 3.1 — Crear componente `DialogueAssessor.tsx`

Crea `src/components/DialogueAssessor.tsx` como variante de `VoiceAssessor.tsx`. La diferencia es la pantalla de contexto previa:

**Flujo UX del modo diálogo:**

```
┌─────────────────────────────────────────────────────┐
│  [Imagen de contexto]                               │
│                                                     │
│  💬 El turista dice:                                │
│  ┌─────────────────────────────────────────────┐   │
│  │  "Quanto tempo dura a trilha?"          [▶] │   │  ← audio automático al cargar
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  🎤 Tu respuesta en português:                      │
│  "A caminhada dura aproximadamente duas horas."     │
│                                                     │
│  [ ● Grabar respuesta ]                             │
└─────────────────────────────────────────────────────┘
```

**Comportamiento:**
- Al cargar la pantalla, reproducir automáticamente el audio de `dialogue_trigger_pt` usando AWS Polly (o Web Speech API como fallback), con un delay de 800ms para que el usuario vea la pantalla antes de escuchar
- El audio de la frase disparadora usa la misma voz pt-BR configurada en el resto de la app
- Mostrar `dialogue_trigger_es` debajo de la burbuja como traducción al español (texto más pequeño, color gris)
- El botón de grabar y el scoring funcionan exactamente igual que en `VoiceAssessor`: graba la respuesta del usuario, compara contra `phrase_pt` con Levenshtein, score ≥ 0.85 = éxito
- El usuario también puede presionar `[▶]` para escuchar la **respuesta correcta** (`phrase_pt`) antes de grabar, igual que en el modo estándar

**Props del componente:**
```typescript
interface DialogueAssessorProps {
  lesson: Lesson;  // debe tener dialogue_trigger_pt definido
  onComplete: (score: number) => void;
  onNext: () => void;
}
```

---

### Paso 3.2 — Integrar `DialogueAssessor` en la pantalla de lección

En `src/app/lesson/[id]/LessonClient.tsx` (o el componente que renderiza cada lección), agrega la lógica de selección de modo:

```typescript
// Selección de modo según contenido de la lección
const isDialogueMode = Boolean(lesson.dialogue_trigger_pt);

return isDialogueMode
  ? <DialogueAssessor lesson={lesson} onComplete={handleComplete} onNext={handleNext} />
  : <VoiceAssessor    lesson={lesson} onComplete={handleComplete} onNext={handleNext} />;
```

No requiere configuración del usuario — el modo se activa automáticamente si la lección tiene trigger definido.

---

### Paso 3.3 — Agregar `dialogue_trigger_pt/es` a lecciones existentes

Actualiza las siguientes lecciones en `lessons.ts` agregando las propiedades de diálogo. No cambiar ninguna otra propiedad existente.

**M10 – Trekking y Senderismo** (agregar triggers a lecciones que sean respuestas del guía):

```typescript
// Lección existente sobre duración de la caminata
// Buscar por phrase_pt que contenga "A caminhada dura" o equivalente
dialogue_trigger_pt: "Quanto tempo dura a trilha?",
dialogue_trigger_es: "¿Cuánto tiempo dura la caminata?",
speaker_role: "guide"

// Lección existente sobre seguridad de la trilha
dialogue_trigger_pt: "A trilha é segura?",
dialogue_trigger_es: "¿El sendero es seguro?",
speaker_role: "guide"

// Lección existente sobre dificultad del trekking
dialogue_trigger_pt: "O trekking é difícil?",
dialogue_trigger_es: "¿El trekking es difícil?",
speaker_role: "guide"
```

**M11 – Cabalgatas** (lecciones nuevas ya tienen speaker_role, agregar triggers):

```typescript
// m11-l14 — respuesta a turista inseguro
dialogue_trigger_pt: "Socorro, ele está indo muito rápido!",
dialogue_trigger_es: "¡Socorro, está yendo muy rápido!",

// m11-l13 — instrucción de distancia
dialogue_trigger_pt: "Posso me aproximar do cavalo da frente?",
dialogue_trigger_es: "¿Puedo acercarme al caballo de adelante?",
```

**M14 – Emergencias** (m14-l07 ya tiene trigger implícito):

```typescript
// m14-l07: "Precisa de ajuda médica?"
dialogue_trigger_pt: "Eu me machuquei durante o passeio.",
dialogue_trigger_es: "Me lastimé durante el paseo.",
speaker_role: "guide"
```

**M15 – Rafting** (m15-l09 ya tiene trigger definido desde Sprint 1 — verificar que esté):
```typescript
// m15-l09: confirmar que dialogue_trigger_pt está presente
// Si no quedó en Sprint 1, agregarlo:
dialogue_trigger_pt: "O passeio é seguro? Precisa saber nadar para fazer o rafting?",
dialogue_trigger_es: "¿El paseo es seguro? ¿Se necesita saber nadar para el rafting?",
```

---

### Paso 3.4 — Indicador visual de modo diálogo en la sidebar de lecciones

En `LessonSidebar`, agrega un ícono pequeño `💬` junto al título de las lecciones que tienen `dialogue_trigger_pt` definido, para que el usuario sepa de antemano que esa lección es un diálogo.

---

### Paso 3.5 — Ejecutar scripts

```bash
npx tsx scripts/seed-db.ts
npm run generate-audio
```

Verificar que los nuevos campos `dialogue_trigger_pt` y `dialogue_trigger_es` quedaron guardados en DynamoDB (el seed debe incluirlos en el schema).

---

## SPRINT 4 — Selector de Rol

### Descripción

Permite al usuario filtrar las lecciones de un módulo según el **rol del hablante**: ver solo las frases que dice el guía/staff, o solo las que dice el turista. Es un toggle en la pantalla de módulo, no un cambio de ruta.

---

### Paso 4.1 — Toggle de rol en la pantalla de módulo

En la pantalla de detalle del módulo (donde se lista el sidebar de lecciones), agrega un toggle visible encima de la lista:

```
[ 🧑‍🏫 Guía / Staff ]   [ 🧳 Turista ]   [ Todos ]
```

- Estado por defecto: **Todos** (comportamiento actual, sin filtro)
- El toggle persiste en `localStorage` con clave `preferred_role` (global, no por módulo) — si el usuario es siempre guía, no tiene que cambiar el toggle cada vez
- Solo mostrar el toggle si el módulo tiene lecciones con `speaker_role` definido en al menos dos roles distintos. Si todas las lecciones son del mismo rol (o ninguna tiene speaker_role), ocultar el toggle.

**Lógica de filtrado:**
```typescript
const filteredLessons = selectedRole === "all"
  ? lessons
  : lessons.filter(l =>
      selectedRole === "tourist"
        ? l.speaker_role === "tourist"
        : l.speaker_role !== "tourist" // guide, receptionist, agent
    );
```

---

### Paso 4.2 — Modo comprensión auditiva para rol "Turista"

Cuando el usuario selecciona el rol **Turista** y entra a una lección con `speaker_role: "tourist"`, el modo de práctica cambia: en lugar de grabar para hacer match con la frase, el usuario **escucha** la frase en pt-BR y selecciona la traducción correcta entre 3 opciones.

**Flujo UX:**

```
┌────────────────────────────────────────────┐
│  [Imagen de contexto]                      │
│                                            │
│  Escucha lo que dice el turista:      [▶] │
│                                            │
│  ¿Qué está diciendo?                       │
│  ○ ¿Cuánto tiempo dura la caminata?        │  ← opción correcta
│  ○ ¿El sendero es seguro?                  │
│  ○ ¿Podemos descansar un poco?             │
└────────────────────────────────────────────┘
```

**Generación de opciones incorrectas:**
- Tomar 2 `phrase_es` aleatorias de otras lecciones del mismo módulo
- Mezclar las 3 opciones en orden aleatorio
- Al seleccionar la correcta: animación de éxito (igual al score ≥ 85%)
- Al seleccionar incorrecta: mostrar la correcta en rojo y dar opción de reintentar

**Componente:** Crear `src/components/ListeningAssessor.tsx` con las props:
```typescript
interface ListeningAssessorProps {
  lesson: Lesson;
  allModuleLessons: Lesson[]; // para generar distractores
  onComplete: () => void;
  onNext: () => void;
}
```

**Integración en LessonClient:**
```typescript
const isListeningMode = selectedRole === "tourist" && lesson.speaker_role === "tourist";
const isDialogueMode  = Boolean(lesson.dialogue_trigger_pt);

if (isListeningMode) return <ListeningAssessor ... />;
if (isDialogueMode)  return <DialogueAssessor  ... />;
return                      <VoiceAssessor      ... />;
```

---

### Paso 4.3 — Estadísticas diferenciadas por rol en el progreso

El progreso en `localStorage` y DynamoDB debe registrar en qué modo se completó cada lección:

```typescript
// Extender la llamada POST /api/progress con:
{
  userId,
  lessonId,
  moduleId,
  score,
  mode: "standard" | "dialogue" | "listening"  // NUEVO
}
```

Esto permite en el futuro mostrar en analytics qué mecánica tiene mejor retención. Por ahora solo guardarlo, no requiere cambios en la UI de analytics.

---

## SPRINT 5 — Expansión de contenido M1, M5, M7, M9

### Paso 5.1 — Expandir M1 (Hospitalidad Cercana) de 10 a 20 lecciones

Agrega las siguientes 10 lecciones nuevas al módulo `m1`:

```typescript
// Grupo: Saludos y recepción
{ id: "m1-l11", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Bem-vindo!",
  phrase_es: "¡Bienvenido!",
  context: "Saludo de bienvenida al turista al llegar al establecimiento.",
  imageUrl: "/images/hospitalidad-bienvenido.jpg" },

{ id: "m1-l12", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Como posso ajudar?",
  phrase_es: "¿Cómo puedo ayudarle?",
  context: "Ofrecimiento de asistencia al turista.",
  imageUrl: "/images/hospitalidad-ayudar.jpg" },

{ id: "m1-l13", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Fiquem à vontade.",
  phrase_es: "Estén cómodos. / Sírvanse.",
  context: "Invitación a sentarse o a moverse libremente por el espacio.",
  imageUrl: "/images/hospitalidad-vontade.jpg" },

{ id: "m1-l14", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Tenham um excelente passeio.",
  phrase_es: "Tengan un excelente paseo.",
  context: "Despedida al turista que sale a una actividad.",
  imageUrl: "/images/hospitalidad-passeio.jpg" },

{ id: "m1-l15", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "A reserva está a nome de quem?",
  phrase_es: "¿A nombre de quién está la reserva?",
  context: "Verificación de reserva al momento del check-in o llegada.",
  imageUrl: "/images/hospitalidad-reserva-nome.jpg" },

// Grupo: Preguntas frecuentes
{ id: "m1-l16", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Quanto custa?",
  phrase_es: "¿Cuánto cuesta?",
  context: "Pregunta frecuente del turista sobre precios.",
  imageUrl: "/images/hospitalidad-custo.jpg",
  dialogue_trigger_pt: "Quanto custa a entrada?",
  dialogue_trigger_es: "¿Cuánto cuesta la entrada?" },

{ id: "m1-l17", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Que horas começa?",
  phrase_es: "¿A qué hora comienza?",
  context: "Pregunta del turista sobre horario de inicio de actividad o servicio.",
  imageUrl: "/images/hospitalidad-horas.jpg" },

{ id: "m1-l18", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Tem guia em português?",
  phrase_es: "¿Hay guía en portugués?",
  context: "Pregunta del turista brasileño sobre disponibilidad de guía en su idioma.",
  imageUrl: "/images/hospitalidad-guia-portugues.jpg" },

// Grupo: Atención básica de restaurante
{ id: "m1-l19", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Desejam ver o cardápio?",
  phrase_es: "¿Desean ver el menú?",
  context: "Ofrecimiento del menú al turista en un restaurante o café.",
  imageUrl: "/images/restaurante-cardapio.jpg" },

{ id: "m1-l20", moduleId: "m1", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Este prato é típico chileno.",
  phrase_es: "Este plato es típico chileno.",
  context: "Descripción de un plato al turista que pregunta sobre la comida.",
  imageUrl: "/images/restaurante-prato-tipico.jpg" },
```

Agregar también vocabulario al módulo M1:
```typescript
vocabulary: [
  { word_pt: "cardápio", word_es: "menú / carta" },
  { word_pt: "prato", word_es: "plato" },
  { word_pt: "conta", word_es: "la cuenta" },
  { word_pt: "reserva", word_es: "reserva" },
  { word_pt: "à vontade", word_es: "cómodo / con confianza" },
  { word_pt: "passeio", word_es: "paseo / excursión" },
  { word_pt: "guia", word_es: "guía" },
  { word_pt: "horário", word_es: "horario" },
  { word_pt: "entrada", word_es: "entrada / acceso" },
  { word_pt: "atendimento", word_es: "atención / servicio" },
]
```

---

### Paso 5.2 — Expandir M5 (Alojamiento Turístico) de 10 a 20 lecciones

Agrega 10 lecciones nuevas al módulo `m5`:

```typescript
{ id: "m5-l11", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "O check-in começa às quinze horas.",
  phrase_es: "El check-in comienza a las 15 horas.",
  context: "Respuesta del recepcionista sobre horario de ingreso.",
  imageUrl: "/images/hotel-checkin-hora.jpg",
  dialogue_trigger_pt: "A que horas é o check-in?",
  dialogue_trigger_es: "¿A qué hora es el check-in?" },

{ id: "m5-l12", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Sim, o café da manhã é servido das sete às dez horas.",
  phrase_es: "Sí, el desayuno se sirve de 7 a 10 horas.",
  context: "Respuesta del recepcionista sobre horario de desayuno.",
  imageUrl: "/images/hotel-cafe.jpg",
  dialogue_trigger_pt: "O café da manhã está incluído na diária?",
  dialogue_trigger_es: "¿El desayuno está incluido en la tarifa?" },

{ id: "m5-l13", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Temos estacionamento privativo gratuito para hóspedes.",
  phrase_es: "Tenemos estacionamiento privado gratuito para huéspedes.",
  context: "Información de servicios al turista que llega en auto.",
  imageUrl: "/images/hotel-estacionamento.jpg" },

{ id: "m5-l14", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Sim, o Wi-Fi é gratuito em todo o hotel.",
  phrase_es: "Sí, el Wi-Fi es gratuito en todo el hotel.",
  context: "Respuesta a consulta sobre internet.",
  imageUrl: "/images/hotel-wifi.jpg",
  dialogue_trigger_pt: "Vocês têm Wi-Fi gratuito?",
  dialogue_trigger_es: "¿Tienen Wi-Fi gratuito?" },

{ id: "m5-l15", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Vou reconfigurar a sua chave agora mesmo.",
  phrase_es: "Voy a reconfigurar su tarjeta ahora mismo.",
  context: "Respuesta del recepcionista cuando la llave magnética no funciona.",
  imageUrl: "/images/hotel-chave.jpg",
  dialogue_trigger_pt: "A minha chave magnética não abre a porta do quarto.",
  dialogue_trigger_es: "Mi llave magnética no abre la puerta de la habitación." },

{ id: "m5-l16", moduleId: "m5", difficulty: "intermedio", speaker_role: "receptionist",
  phrase_pt: "Pedimos desculpas pelo inconveniente. Enviaremos a manutenção imediatamente.",
  phrase_es: "Le pedimos disculpas por el inconveniente. Enviaremos mantenimiento de inmediato.",
  context: "Respuesta a queja del turista sobre un problema en la habitación.",
  imageUrl: "/images/hotel-manutencao.jpg" },

{ id: "m5-l17", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Podemos estender a saída até as quatorze horas sem custo adicional.",
  phrase_es: "Podemos extender la salida hasta las 14 horas sin costo adicional.",
  context: "Respuesta a solicitud de late check-out.",
  imageUrl: "/images/hotel-checkout-tardio.jpg",
  dialogue_trigger_pt: "É possível fazer um check-out tardio hoje?",
  dialogue_trigger_es: "¿Es posible hacer un check-out tardío hoy?" },

{ id: "m5-l18", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Com certeza. Providenciaremos um berço para o seu quarto.",
  phrase_es: "Por supuesto. Proporcionaremos una cuna para su habitación.",
  context: "Respuesta a solicitud de cuna para bebé.",
  imageUrl: "/images/hotel-berco.jpg",
  dialogue_trigger_pt: "Eu preciso de um berço extra para o bebê, por favor.",
  dialogue_trigger_es: "Necesito una cuna extra para el bebé, por favor." },

{ id: "m5-l19", moduleId: "m5", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Temos uma sala para guardar bagagens.",
  phrase_es: "Tenemos una sala para guardar equipajes.",
  context: "Respuesta a turista que llega antes del check-in o sale después del check-out.",
  imageUrl: "/images/hotel-bagagem.jpg",
  dialogue_trigger_pt: "Posso deixar as minhas malas na recepção por algumas horas?",
  dialogue_trigger_es: "¿Puedo dejar mis maletas en la recepción por unas horas?" },

{ id: "m5-l20", moduleId: "m5", difficulty: "intermedio", speaker_role: "receptionist",
  phrase_pt: "Esperamos recebê-lo novamente. Tenha uma excelente viagem de volta!",
  phrase_es: "Esperamos recibirle de nuevo. ¡Que tenga un excelente viaje de regreso!",
  context: "Despedida al turista en el momento del check-out.",
  imageUrl: "/images/hotel-despedida.jpg" },
```

---

### Paso 5.3 — Expandir M7 (Agencia de Viajes) de 10 a 15 lecciones

Agrega 5 lecciones nuevas al módulo `m7`:

```typescript
{ id: "m7-l11", moduleId: "m7", difficulty: "básico", speaker_role: "agent",
  phrase_pt: "Este pacote inclui transporte, guia e atividades.",
  phrase_es: "Este paquete incluye transporte, guía y actividades.",
  context: "Descripción de los servicios incluidos en un paquete turístico.",
  imageUrl: "/images/agencia-pacote.jpg",
  dialogue_trigger_pt: "O que está incluído no pacote turístico?",
  dialogue_trigger_es: "¿Qué está incluido en el paquete turístico?" },

{ id: "m7-l12", moduleId: "m7", difficulty: "básico", speaker_role: "agent",
  phrase_pt: "Ainda temos vagas disponíveis para esta data.",
  phrase_es: "Todavía tenemos cupos disponibles para esta fecha.",
  context: "Confirmación de disponibilidad al turista que consulta.",
  imageUrl: "/images/agencia-vagas.jpg",
  dialogue_trigger_pt: "Há vagas disponíveis para esta data?",
  dialogue_trigger_es: "¿Hay cupos disponibles para esta fecha?" },

{ id: "m7-l13", moduleId: "m7", difficulty: "intermedio", speaker_role: "agent",
  phrase_pt: "Em caso de condições climáticas adversas, o passeio poderá ser reagendado.",
  phrase_es: "En caso de condiciones climáticas adversas, el paseo podrá ser reprogramado.",
  context: "Política de cancelación y reagendamiento por clima.",
  imageUrl: "/images/agencia-clima.jpg",
  dialogue_trigger_pt: "O passeio acontece mesmo com chuva?",
  dialogue_trigger_es: "¿El paseo se realiza aunque llueva?" },

{ id: "m7-l14", moduleId: "m7", difficulty: "básico", speaker_role: "agent",
  phrase_pt: "Posso enviar todas as informações por WhatsApp ou e-mail.",
  phrase_es: "Puedo enviar toda la información por WhatsApp o correo electrónico.",
  context: "Ofrecimiento de envío de información al turista interesado.",
  imageUrl: "/images/agencia-whatsapp.jpg",
  dialogue_trigger_pt: "Gostaria de receber mais informações por WhatsApp.",
  dialogue_trigger_es: "Me gustaría recibir más información por WhatsApp." },

{ id: "m7-l15", moduleId: "m7", difficulty: "básico", speaker_role: "agent",
  phrase_pt: "Oferecemos descontos para grupos e famílias.",
  phrase_es: "Ofrecemos descuentos para grupos y familias.",
  context: "Información sobre tarifas especiales para grupos.",
  imageUrl: "/images/agencia-desconto.jpg",
  dialogue_trigger_pt: "Vocês oferecem descontos para grupos?",
  dialogue_trigger_es: "¿Ofrecen descuentos para grupos?" },
```

---

### Paso 5.4 — Expandir M9 (Tour Operador) de 10 a 15 lecciones

Agrega 5 lecciones nuevas al módulo `m9`:

```typescript
{ id: "m9-l11", moduleId: "m9", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Sim, contamos com guias que falam português.",
  phrase_es: "Sí, contamos con guías que hablan portugués.",
  context: "Respuesta a consulta del turista sobre idioma del guía.",
  imageUrl: "/images/tourop-guia-pt.jpg",
  dialogue_trigger_pt: "O guia fala português?",
  dialogue_trigger_es: "¿El guía habla portugués?" },

{ id: "m9-l12", moduleId: "m9", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Todos os participantes contam com seguro durante a atividade.",
  phrase_es: "Todos los participantes cuentan con seguro durante la actividad.",
  context: "Información sobre cobertura de seguro incluido en la actividad.",
  imageUrl: "/images/tourop-seguro.jpg",
  dialogue_trigger_pt: "Há seguro para os participantes?",
  dialogue_trigger_es: "¿Hay seguro para los participantes?" },

{ id: "m9-l13", moduleId: "m9", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Recomendamos trazer roupa confortável, protetor solar e água.",
  phrase_es: "Recomendamos traer ropa cómoda, protector solar y agua.",
  context: "Instrucciones de preparación al turista antes de la actividad.",
  imageUrl: "/images/tourop-equipamento.jpg",
  dialogue_trigger_pt: "Preciso levar algum equipamento especial?",
  dialogue_trigger_es: "¿Necesito traer algún equipamiento especial?" },

{ id: "m9-l14", moduleId: "m9", difficulty: "intermedio", speaker_role: "guide",
  phrase_pt: "O ponto de encontro será informado após a confirmação da reserva.",
  phrase_es: "El punto de encuentro será informado tras la confirmación de la reserva.",
  context: "Respuesta a consulta sobre dónde y cuándo reunirse para la actividad.",
  imageUrl: "/images/tourop-ponto.jpg",
  dialogue_trigger_pt: "Qual é o ponto de encontro para o passeio?",
  dialogue_trigger_es: "¿Cuál es el punto de encuentro para el paseo?" },

{ id: "m9-l15", moduleId: "m9", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Temos programas de trekking, cavalgadas, rafting e turismo rural.",
  phrase_es: "Tenemos programas de trekking, cabalgatas, rafting y turismo rural.",
  context: "Presentación de la oferta de actividades al turista.",
  imageUrl: "/images/tourop-programas.jpg",
  dialogue_trigger_pt: "Vocês oferecem passeios de trekking ou cavalgada?",
  dialogue_trigger_es: "¿Ofrecen paseos de trekking o cabalgata?" },
```

---

### Paso 5.5 — Ejecutar scripts de actualización

```bash
npx tsx scripts/seed-db.ts
npm run generate-audio
```

Verificar que los módulos M1 y M5 muestran 20 lecciones, y M7 y M9 muestran 15 lecciones en el FlavorMap.

---

## Checklist final — Sprints 3, 4 y 5

### Sprint 3 — Modo Diálogo
- [ ] Componente `DialogueAssessor.tsx` creado con reproducción automática del trigger
- [ ] `LessonClient.tsx` selecciona `DialogueAssessor` cuando `dialogue_trigger_pt` está definido
- [ ] Triggers agregados a lecciones de M10, M11, M14, M15
- [ ] Ícono `💬` en `LessonSidebar` para lecciones en modo diálogo
- [ ] `seed-db.ts` y `generate-audio` ejecutados

### Sprint 4 — Selector de Rol
- [ ] Toggle Guía / Turista / Todos implementado en pantalla de módulo
- [ ] Preferencia de rol persistida en `localStorage` con clave `preferred_role`
- [ ] Toggle visible solo cuando el módulo tiene roles mixtos
- [ ] Componente `ListeningAssessor.tsx` creado con selección de traducción correcta
- [ ] `LessonClient.tsx` selecciona `ListeningAssessor` en modo turista
- [ ] Campo `mode` agregado al payload de `POST /api/progress`

### Sprint 5 — Expansión de contenido
- [ ] M1 expandido a 20 lecciones + vocabulario agregado
- [ ] M5 expandido a 20 lecciones (10 con dialogue_trigger)
- [ ] M7 expandido a 15 lecciones (5 con dialogue_trigger)
- [ ] M9 expandido a 15 lecciones (5 con dialogue_trigger)
- [ ] `seed-db.ts` y `generate-audio` ejecutados
- [ ] Verificar en FlavorMap que los contadores de lecciones son correctos

---

## Resumen numérico post-implementación completa

| Módulo | Lecciones v1 | Lecciones v2 final |
|---|---|---|
| M1 – Hospitalidad | 10 | 20 |
| M2–M4 – Gastronomía | 30 | 30 (sin cambios) |
| M5 – Alojamiento | 10 | 20 |
| M6 – Transporte | 10 | 10 (sin cambios) |
| M7 – Agencia Viajes | 10 | 15 |
| M8 – Guiado Turístico | 10 | 10 (sin cambios) |
| M9 – Tour Operador | 10 | 15 |
| M10 – Trekking | 10 | 10 + triggers |
| M11 – Cabalgatas | 10 | 15 + triggers |
| M12 – Arriendo Equip. | 10 | 10 (sin cambios) |
| M13 – Alimentación | 10 | 10 (sin cambios) |
| M14 – Emergencias *(nuevo)* | — | 10 |
| M15 – Rafting & Kayak *(nuevo)* | — | 10 |
| **TOTAL** | **130** | **185** |

**Mecánicas activas al terminar v2:**
- `VoiceAssessor` — pronunciación estándar (todas las lecciones)
- `DialogueAssessor` — práctica en contexto de conversación (lecciones con trigger)
- `ListeningAssessor` — comprensión auditiva (lecciones con speaker_role: "tourist")
- `VocabCard` — flashcards de vocabulario esencial (pantalla previa por módulo)
