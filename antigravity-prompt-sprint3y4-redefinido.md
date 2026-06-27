# Prompt para Antigravity IDE — Sabor & Sotaque v2 / Sprints 3 y 4 (Redefinidos)

---

## Contexto del proyecto

Continuación de la implementación v2 de **Sabor & Sotaque**. Los Sprints 1 y 2 ya están implementados:

- ✅ M14 (Emergencias) y M15 (Rafting & Kayak) creados
- ✅ M11 expandido a 15 lecciones, M10 / M5 / M7 con vocabulario agregado
- ✅ Categoría `"seguridad"` y tab en FlavorMap operativos
- ✅ Pantalla de vocabulario `/lesson/[moduleId]/vocab` con componente `VocabCard`
- ✅ Tipos `Lesson` extendidos con `dialogue_trigger_pt/es`, `speaker_role`, `difficulty`

Stack: Next.js 16 / React 19 / TailwindCSS v4 / AWS (DynamoDB, Polly, Cognito). Componente de evaluación de voz existente: `VoiceAssessor.tsx` (Web Speech API + scoring Levenshtein ≥ 0.85). Diseño: dark premium, fondo negro, acentos ámbar `#f59e0b`.

**Regla crítica (AGENTS.md):** Cada vez que se modifica `src/lib/lessons.ts` ejecutar:
1. `npx tsx scripts/seed-db.ts`
2. `npm run generate-audio`

---

## SPRINT 3 — Expressões Frequentes

### Descripción

Cada módulo relevante incorpora una sección de **expresiones de uso frecuente**: frases cortas, coloquiales y de alta repetición que el trabajador necesita en la atención diaria. Son distintas a las lecciones formales — más breves, más reactivas, más del habla real.

Se practican con el `VoiceAssessor` estándar existente. **No se requiere ningún componente nuevo** para la práctica en sí — solo cambios de tipo de dato y UI de presentación.

---

### Paso 3.1 — Extender el tipo `Lesson` con `lesson_type`

En `src/lib/lessons.ts`, agregar la propiedad opcional `lesson_type` a la interfaz `Lesson`:

```typescript
interface Lesson {
  // propiedades ya existentes — NO modificar
  id: string;
  moduleId: string;
  phrase_pt: string;
  phrase_es: string;
  context: string;
  imageUrl: string;
  dialogue_trigger_pt?: string;
  dialogue_trigger_es?: string;
  speaker_role?: "guide" | "tourist" | "receptionist" | "agent";
  difficulty?: "básico" | "intermedio" | "avanzado";
  // NUEVA propiedad Sprint 3
  lesson_type?: "lesson" | "expression"; // default implícito: "lesson"
}
```

Las lecciones existentes no necesitan actualización — sin `lesson_type` se comportan como `"lesson"` por defecto.

---

### Paso 3.2 — Agregar expressões a los módulos

Agrega las siguientes entradas a `lessons.ts`. Todas tienen `lesson_type: "expression"`. Las `imageUrl` pueden ser las mismas que otras lecciones del mismo módulo o un placeholder genérico `/images/expression-placeholder.jpg`.

**M1 – Hospitalidad Cercana (6 expressões):**

```typescript
{ id: "m1-exp-01", moduleId: "m1", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Claro, sem problema!",
  phrase_es: "¡Claro, sin problema!",
  context: "Respuesta positiva inmediata a cualquier solicitud del turista.",
  imageUrl: "/images/hospitalidad-bienvenido.jpg" },

{ id: "m1-exp-02", moduleId: "m1", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Com licença.",
  phrase_es: "Con permiso. / Disculpe.",
  context: "Al pasar cerca del turista o interrumpir brevemente.",
  imageUrl: "/images/hospitalidad-bienvenido.jpg" },

{ id: "m1-exp-03", moduleId: "m1", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Obrigado pela visita!",
  phrase_es: "¡Gracias por la visita!",
  context: "Despedida cálida al turista al final de su estadía o visita.",
  imageUrl: "/images/hospitalidad-bienvenido.jpg" },

{ id: "m1-exp-04", moduleId: "m1", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Voltem sempre!",
  phrase_es: "¡Vuelvan siempre!",
  context: "Despedida que invita al turista a regresar.",
  imageUrl: "/images/hospitalidad-bienvenido.jpg" },

{ id: "m1-exp-05", moduleId: "m1", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Um momento, por favor.",
  phrase_es: "Un momento, por favor.",
  context: "Cuando el turista espera y el staff necesita verificar algo.",
  imageUrl: "/images/hospitalidad-bienvenido.jpg" },

{ id: "m1-exp-06", moduleId: "m1", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Com prazer!",
  phrase_es: "¡Con mucho gusto!",
  context: "Respuesta amable al agradecer cualquier servicio prestado.",
  imageUrl: "/images/hospitalidad-bienvenido.jpg" },
```

**M5 – Alojamiento Turístico (5 expressões):**

```typescript
{ id: "m5-exp-01", moduleId: "m5", lesson_type: "expression", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Seja bem-vindo!",
  phrase_es: "¡Sea bienvenido!",
  context: "Saludo de recepción al turista al entrar al hotel.",
  imageUrl: "/images/hotel-checkin-hora.jpg" },

{ id: "m5-exp-02", moduleId: "m5", lesson_type: "expression", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Às suas ordens.",
  phrase_es: "A sus órdenes.",
  context: "Disponibilidad inmediata ante cualquier necesidad del turista.",
  imageUrl: "/images/hotel-checkin-hora.jpg" },

{ id: "m5-exp-03", moduleId: "m5", lesson_type: "expression", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Já verifico para você.",
  phrase_es: "Ya verifico para usted.",
  context: "Cuando el recepcionista va a consultar información solicitada.",
  imageUrl: "/images/hotel-checkin-hora.jpg" },

{ id: "m5-exp-04", moduleId: "m5", lesson_type: "expression", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Boa estadia!",
  phrase_es: "¡Buena estadía!",
  context: "Deseo al turista al momento del check-in o entrega de llaves.",
  imageUrl: "/images/hotel-checkin-hora.jpg" },

{ id: "m5-exp-05", moduleId: "m5", lesson_type: "expression", difficulty: "básico", speaker_role: "receptionist",
  phrase_pt: "Qualquer coisa, é só chamar.",
  phrase_es: "Cualquier cosa, solo llame.",
  context: "Ofrecimiento de disponibilidad continua al turista hospedado.",
  imageUrl: "/images/hotel-checkin-hora.jpg" },
```

**M10 – Trekking y Senderismo (6 expressões):**

```typescript
{ id: "m10-exp-01", moduleId: "m10", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Vamos com calma!",
  phrase_es: "¡Vamos con calma!",
  context: "Indicación de ritmo pausado en tramos de dificultad.",
  imageUrl: "/images/trekking-placeholder.jpg" },

{ id: "m10-exp-02", moduleId: "m10", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Quase lá!",
  phrase_es: "¡Ya casi llegamos!",
  context: "Motivación al grupo cerca de la cima o del destino.",
  imageUrl: "/images/trekking-placeholder.jpg" },

{ id: "m10-exp-03", moduleId: "m10", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Atenção ao degrau!",
  phrase_es: "¡Atención al escalón!",
  context: "Advertencia de seguridad ante un obstáculo en el sendero.",
  imageUrl: "/images/trekking-placeholder.jpg" },

{ id: "m10-exp-04", moduleId: "m10", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Sigam o meu ritmo.",
  phrase_es: "Sigan mi ritmo.",
  context: "Instrucción de ritmo de marcha al inicio o en tramos difíciles.",
  imageUrl: "/images/trekking-placeholder.jpg" },

{ id: "m10-exp-05", moduleId: "m10", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Vamos fazer uma parada aqui.",
  phrase_es: "Vamos a hacer una parada aquí.",
  context: "Indicación de descanso en un punto del sendero.",
  imageUrl: "/images/trekking-placeholder.jpg" },

{ id: "m10-exp-06", moduleId: "m10", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Muito bem, pessoal!",
  phrase_es: "¡Muy bien, chicos!",
  context: "Elogio motivacional al grupo al superar un tramo difícil.",
  imageUrl: "/images/trekking-placeholder.jpg" },
```

**M11 – Cabalgatas (5 expressões):**

```typescript
{ id: "m11-exp-01", moduleId: "m11", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Firme nas rédeas!",
  phrase_es: "¡Firme en las riendas!",
  context: "Corrección rápida cuando el turista suelta las riendas.",
  imageUrl: "/images/cabalgata-redeas.jpg" },

{ id: "m11-exp-02", moduleId: "m11", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Calma, cavaleiro!",
  phrase_es: "¡Calma, jinete!",
  context: "Instrucción de control cuando el turista se pone tenso o nervioso.",
  imageUrl: "/images/cabalgata-calma.jpg" },

{ id: "m11-exp-03", moduleId: "m11", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Muito bem!",
  phrase_es: "¡Muy bien!",
  context: "Refuerzo positivo cuando el turista ejecuta bien una instrucción.",
  imageUrl: "/images/cabalgata-calma.jpg" },

{ id: "m11-exp-04", moduleId: "m11", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Relaxem os ombros.",
  phrase_es: "Relajen los hombros.",
  context: "Corrección postural frecuente durante la cabalgata.",
  imageUrl: "/images/cabalgata-redeas.jpg" },

{ id: "m11-exp-05", moduleId: "m11", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Mantenham o equilíbrio.",
  phrase_es: "Mantengan el equilibrio.",
  context: "Instrucción de postura en tramos con pendiente o terreno irregular.",
  imageUrl: "/images/cabalgata-redeas.jpg" },
```

**M14 – Emergencias Turísticas (4 expressões):**

```typescript
{ id: "m14-exp-01", moduleId: "m14", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Calma, por favor.",
  phrase_es: "Calma, por favor.",
  context: "Primer comando en cualquier situación de emergencia.",
  imageUrl: "/images/emergencia-calma.jpg" },

{ id: "m14-exp-02", moduleId: "m14", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Estou aqui.",
  phrase_es: "Estoy aquí.",
  context: "Presencia tranquilizadora junto al turista afectado.",
  imageUrl: "/images/emergencia-calma.jpg" },

{ id: "m14-exp-03", moduleId: "m14", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Não se movam.",
  phrase_es: "No se muevan.",
  context: "Instrucción de seguridad inmediata ante un riesgo activo.",
  imageUrl: "/images/emergencia-calma.jpg" },

{ id: "m14-exp-04", moduleId: "m14", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Já chamei socorro.",
  phrase_es: "Ya llamé al socorro.",
  context: "Comunicación al turista de que la ayuda ya fue solicitada.",
  imageUrl: "/images/emergencia-ambulancia.jpg" },
```

**M15 – Rafting & Kayak (5 expressões):**

```typescript
{ id: "m15-exp-01", moduleId: "m15", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Frente!",
  phrase_es: "¡Adelante!",
  context: "Comando de remo hacia adelante durante el descenso.",
  imageUrl: "/images/rafting-frente.jpg" },

{ id: "m15-exp-02", moduleId: "m15", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Trás!",
  phrase_es: "¡Atrás!",
  context: "Comando de remo hacia atrás durante el descenso.",
  imageUrl: "/images/rafting-tras.jpg" },

{ id: "m15-exp-03", moduleId: "m15", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Parem!",
  phrase_es: "¡Paren!",
  context: "Comando de detención inmediata del remo.",
  imageUrl: "/images/rafting-atencion.jpg" },

{ id: "m15-exp-04", moduleId: "m15", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Todos juntos!",
  phrase_es: "¡Todos juntos!",
  context: "Llamado a sincronizar el esfuerzo del equipo en un rápido.",
  imageUrl: "/images/rafting-atencion.jpg" },

{ id: "m15-exp-05", moduleId: "m15", lesson_type: "expression", difficulty: "básico", speaker_role: "guide",
  phrase_pt: "Muito bem, equipe!",
  phrase_es: "¡Muy bien, equipo!",
  context: "Refuerzo positivo al pasar un rápido con éxito.",
  imageUrl: "/images/rafting-atencion.jpg" },
```

---

### Paso 3.3 — UI: sección Expressões dentro de cada módulo

En la pantalla de detalle del módulo (donde se lista el sidebar o la lista de lecciones), agregar un bloque **"Expressões Frequentes"** encima de la lista de lecciones estándar.

**Comportamiento:**
- Mostrar el bloque solo si el módulo tiene lecciones con `lesson_type: "expression"`
- Las expresiones se muestran como **pills horizontales scrolleables** (no como filas de lección completas) para distinguirlas visualmente
- Al tocar una pill, abrir la lección con el `VoiceAssessor` estándar — sin cambio de mecánica
- Las pills completadas muestran un check ámbar `✓`

**Diseño de la pill:**
```
[ ✓ Frente!  ▶ ]  [ Trás!  ▶ ]  [ Parem!  ▶ ]  →  scroll horizontal
```
- Fondo: `bg-zinc-800` (diferenciado del fondo de lecciones)
- Borde: `border border-amber-500/30`
- Texto: blanco, bold, compacto
- Ícono de audio `▶` en ámbar para reproducir sin abrir la lección completa (usar Web Speech API con `lang: 'pt-BR'` directamente desde la pill)

---

### Paso 3.4 — Ejecutar scripts Sprint 3

```bash
npx tsx scripts/seed-db.ts
npm run generate-audio
```

Verificar que se generan audios para las ~31 expressões nuevas.

---

## SPRINT 4 — Perguntas & Respostas Frequentes (FAQ)

### Descripción

Cada módulo relevante incorpora una sección **"Perguntas Frequentes"** con pares Pregunta del turista brasileño → Respuesta del prestador de servicios. El usuario ve la pregunta en pantalla, puede escucharla en pt-BR, y practica grabar la respuesta correcta con el `VoiceAssessor`.

---

### Paso 4.1 — Crear tipo `FAQ` y archivo `src/lib/faqs.ts`

Crear el archivo `src/lib/faqs.ts` con la siguiente estructura:

```typescript
export interface FAQ {
  id: string;
  moduleId: string;
  question_pt: string;    // Lo que dice el turista
  question_es: string;    // Traducción al español de la pregunta
  answer_pt: string;      // La respuesta que debe practicar el usuario
  answer_es: string;      // Traducción al español de la respuesta
  context?: string;       // Situación en que ocurre este intercambio
  audioFile_question?: string;  // MP3 Polly de la pregunta (generado por script)
  audioFile_answer?: string;    // MP3 Polly de la respuesta (generado por script)
}

export const faqs: FAQ[] = [
  // M10 – Trekking
  {
    id: "m10-faq-01", moduleId: "m10",
    question_pt: "Quanto tempo dura a trilha?",
    question_es: "¿Cuánto tiempo dura la caminata?",
    answer_pt: "A caminhada dura aproximadamente duas horas.",
    answer_es: "La caminata dura aproximadamente dos horas.",
    context: "Pregunta frecuente al inicio de la actividad de trekking."
  },
  {
    id: "m10-faq-02", moduleId: "m10",
    question_pt: "A trilha é muito difícil?",
    question_es: "¿El sendero es muy difícil?",
    answer_pt: "É de dificuldade moderada, adequada para a maioria dos visitantes.",
    answer_es: "Es de dificultad moderada, adecuada para la mayoría de los visitantes.",
    context: "Turista evaluando si puede participar en la actividad."
  },
  {
    id: "m10-faq-03", moduleId: "m10",
    question_pt: "Podemos descansar um pouco?",
    question_es: "¿Podemos descansar un poco?",
    answer_pt: "Claro! Vamos fazer uma parada aqui.",
    answer_es: "¡Claro! Vamos a hacer una parada aquí.",
    context: "Solicitud de descanso durante el trekking."
  },
  {
    id: "m10-faq-04", moduleId: "m10",
    question_pt: "Tem banheiro no caminho?",
    question_es: "¿Hay baño en el camino?",
    answer_pt: "Há um ponto de parada com instalações a quarenta minutos daqui.",
    answer_es: "Hay un punto de parada con instalaciones a cuarenta minutos de aquí.",
    context: "Pregunta logística frecuente en rutas de trekking."
  },

  // M11 – Cabalgatas
  {
    id: "m11-faq-01", moduleId: "m11",
    question_pt: "Nunca montei a cavalo. É seguro para mim?",
    question_es: "Nunca monté a caballo. ¿Es seguro para mí?",
    answer_pt: "Sim, é seguro. Vou te orientar em cada etapa do passeio.",
    answer_es: "Sí, es seguro. Te guiaré en cada etapa del paseo.",
    context: "Turista sin experiencia que expresa inseguridad antes de montar."
  },
  {
    id: "m11-faq-02", moduleId: "m11",
    question_pt: "Posso tirar fotos durante o passeio?",
    question_es: "¿Puedo sacar fotos durante el paseo?",
    answer_pt: "Sim, mas sem movimentos bruscos para não assustar os cavalos.",
    answer_es: "Sí, pero sin movimientos bruscos para no asustar a los caballos.",
    context: "Turista que quiere fotografiar durante la cabalgata."
  },
  {
    id: "m11-faq-03", moduleId: "m11",
    question_pt: "Qual é o peso máximo para participar?",
    question_es: "¿Cuál es el peso máximo para participar?",
    answer_pt: "O limite é de cem quilos por cavalo.",
    answer_es: "El límite es de cien kilos por caballo.",
    context: "Consulta técnica frecuente antes de confirmar la actividad."
  },

  // M15 – Rafting & Kayak
  {
    id: "m15-faq-01", moduleId: "m15",
    question_pt: "Precisa saber nadar para fazer o rafting?",
    question_es: "¿Se necesita saber nadar para hacer rafting?",
    answer_pt: "Não é necessário. O colete salva-vidas garante a sua segurança.",
    answer_es: "No es necesario. El chaleco salvavidas garantiza su seguridad.",
    context: "Pregunta de seguridad más frecuente antes de la actividad de rafting."
  },
  {
    id: "m15-faq-02", moduleId: "m15",
    question_pt: "Tem limite de idade para participar?",
    question_es: "¿Hay límite de edad para participar?",
    answer_pt: "Sim, a atividade é permitida para maiores de doze anos.",
    answer_es: "Sí, la actividad está permitida para mayores de doce años.",
    context: "Turista que consulta sobre la edad mínima para sus hijos."
  },
  {
    id: "m15-faq-03", moduleId: "m15",
    question_pt: "O que acontece se eu cair na água?",
    question_es: "¿Qué pasa si me caigo al agua?",
    answer_pt: "Não se preocupe. Fique de barriga para cima e nós te resgatamos rapidamente.",
    answer_es: "No se preocupe. Quédese boca arriba y lo rescatamos rápidamente.",
    context: "Pregunta de seguridad antes del inicio del descenso."
  },

  // M14 – Emergencias
  {
    id: "m14-faq-01", moduleId: "m14",
    question_pt: "O que aconteceu?",
    question_es: "¿Qué pasó?",
    answer_pt: "Houve um incidente. Estamos cuidando da situação.",
    answer_es: "Hubo un incidente. Estamos manejando la situación.",
    context: "Turista que pregunta sobre lo ocurrido durante una emergencia."
  },
  {
    id: "m14-faq-02", moduleId: "m14",
    question_pt: "Precisamos sair daqui agora?",
    question_es: "¿Necesitamos salir de aquí ahora?",
    answer_pt: "Sim, vamos evacuar a área com calma e em ordem.",
    answer_es: "Sí, vamos a evacuar el área con calma y en orden.",
    context: "Turista asustado que busca instrucción directa durante evacuación."
  },

  // M5 – Alojamiento
  {
    id: "m5-faq-01", moduleId: "m5",
    question_pt: "O quarto estaria disponível antes do check-in?",
    question_es: "¿El cuarto estaría disponible antes del check-in?",
    answer_pt: "Vou verificar a disponibilidade e te aviso em seguida.",
    answer_es: "Voy a verificar la disponibilidad y te aviso enseguida.",
    context: "Turista que llega antes del horario de check-in."
  },
  {
    id: "m5-faq-02", moduleId: "m5",
    question_pt: "Tem algum restaurante perto do hotel?",
    question_es: "¿Hay algún restaurante cerca del hotel?",
    answer_pt: "Sim, posso indicar algumas opções bem próximas ao hotel.",
    answer_es: "Sí, puedo indicarle algunas opciones muy cercanas al hotel.",
    context: "Turista que busca dónde cenar cerca del alojamiento."
  },

  // M7 – Agencia de Viajes
  {
    id: "m7-faq-01", moduleId: "m7",
    question_pt: "É possível personalizar o roteiro?",
    question_es: "¿Es posible personalizar el itinerario?",
    answer_pt: "Sim, oferecemos roteiros personalizados conforme os seus interesses.",
    answer_es: "Sí, ofrecemos itinerarios personalizados según sus intereses.",
    context: "Turista que quiere adaptar el paquete a sus preferencias."
  },
  {
    id: "m7-faq-02", moduleId: "m7",
    question_pt: "O passeio sai mesmo com poucas pessoas?",
    question_es: "¿El paseo sale aunque haya pocas personas?",
    answer_pt: "Sim, garantimos a saída com um mínimo de dois participantes.",
    answer_es: "Sí, garantizamos la salida con un mínimo de dos participantes.",
    context: "Turista preocupado por si el paseo se cancela por bajo número."
  },
];
```

---

### Paso 4.2 — Crear componente `FAQAssessor.tsx`

Crear `src/components/FAQAssessor.tsx`. Es una variante ligera de `VoiceAssessor` que agrega un bloque de contexto superior con la pregunta del turista.

**Layout del componente:**

```
┌─────────────────────────────────────────────────────────┐
│  🧳 O turista pergunta:                                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  "Quanto tempo dura a trilha?"              [▶]  │  │  ← botón audio pregunta
│  │  ¿Cuánto tiempo dura la caminata?                │  │  ← traducción, gris
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Tua resposta em português:                             │
│  "A caminhada dura aproximadamente duas horas."         │
│                                                         │
│  [▶ Ouvir resposta]     [ ● Gravar resposta ]           │
│                                                         │
│  [Barra de score / resultado — igual que VoiceAssessor] │
└─────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface FAQAssessorProps {
  faq: FAQ;
  onComplete: () => void;
  onNext: () => void;
}
```

**Comportamiento del audio:**
- Botón `[▶]` junto a la pregunta: reproduce `faq.audioFile_question` si existe, si no usa `window.speechSynthesis` con `lang: 'pt-BR'` y el texto `faq.question_pt`
- Botón `[▶ Ouvir resposta]`: reproduce `faq.audioFile_answer` si existe, si no usa `speechSynthesis` con `faq.answer_pt`
- El scoring Levenshtein evalúa la grabación del usuario contra `faq.answer_pt` (mismo umbral ≥ 0.85)
- Al completar con éxito, llamar `onComplete()` y guardar progreso en `localStorage` con clave `faq_{faq.id}_completed: true`

**Estilos:** Mantener el diseño dark premium del proyecto. El bloque de pregunta usa `bg-zinc-800 rounded-xl border border-amber-500/20`. El ícono `🧳` puede ser reemplazado según el `speaker_role` si se quiere: `🧳` turista, `🏔️` aventura, `🏨` hotel.

---

### Paso 4.3 — Crear ruta `/module/[moduleId]/faq` (o integrar como tab)

**Opción A — Tab dentro del módulo (recomendada):**
En la pantalla de detalle del módulo, agregar tabs de navegación:

```
[ Expressões ]  [ Lecciones ]  [ Preguntas & Respostas ]
```

- Tab "Lecciones": vista actual (sin cambios)
- Tab "Expressões": pills scrolleables (Sprint 3)
- Tab "Preguntas & Respostas": lista de FAQs del módulo, cada una como card con la pregunta visible y botón "Practicar"

Solo mostrar el tab "Preguntas & Respostas" si el módulo tiene FAQs en `faqs.ts` (`faqs.filter(f => f.moduleId === module.id).length > 0`).

**Card de FAQ en la lista:**
```
┌──────────────────────────────────────────────────────┐
│  🧳 "Quanto tempo dura a trilha?"             [▶]   │
│     ¿Cuánto tiempo dura la caminata?                │
│                                  [ Practicar →  ]   │
└──────────────────────────────────────────────────────┘
```
- Fondo: `bg-zinc-900 border border-zinc-700`
- Al hacer click en "Practicar", abrir `FAQAssessor` con ese FAQ
- FAQs completadas muestran borde ámbar y check `✓`

---

### Paso 4.4 — Actualizar `POST /api/progress` para registrar FAQs completadas

Extender el endpoint existente para aceptar FAQs como unidad de progreso:

```typescript
// Payload extendido
{
  userId: string;
  moduleId: string;
  score: number;
  // UNO de los dos siguientes, nunca los dos juntos:
  lessonId?: string;   // Para lecciones y expressões
  faqId?: string;      // Para FAQs — NUEVO
}
```

Guardar en DynamoDB bajo la misma tabla de progreso, con `type: "faq"` como campo adicional para distinguir.

---

### Paso 4.5 — Agregar script de generación de audio para FAQs

En `scripts/generate-audio.js` (o en un archivo separado `scripts/generate-faq-audio.js`), agregar una sección que:

1. Lea todos los `FAQ` de `src/lib/faqs.ts`
2. Por cada FAQ genere **dos archivos MP3** con AWS Polly (voz pt-BR):
   - `question_pt` → `/public/audio/faq/{faqId}-question.mp3`
   - `answer_pt` → `/public/audio/faq/{faqId}-answer.mp3`
3. Actualice los campos `audioFile_question` y `audioFile_answer` en `faqs.ts` con las rutas resultantes

```bash
npm run generate-faq-audio
```

---

### Paso 4.6 — Ejecutar scripts Sprint 4

```bash
npx tsx scripts/seed-db.ts
npm run generate-audio
npm run generate-faq-audio
```

Verificar que se generan audios para las 16 preguntas y 16 respuestas de los FAQs (~32 archivos MP3 nuevos).

---

## Checklist final — Sprints 3 y 4

### Sprint 3 — Expressões Frequentes
- [ ] Propiedad `lesson_type: "expression" | "lesson"` agregada a la interfaz `Lesson`
- [ ] 31 expressões agregadas a M1, M5, M10, M11, M14, M15
- [ ] Bloque visual de pills scrolleables en pantalla de módulo
- [ ] Pills con botón `▶` de audio directo (sin abrir lección)
- [ ] Pills completadas muestran check ámbar
- [ ] `seed-db.ts` y `generate-audio` ejecutados y verificados

### Sprint 4 — Perguntas & Respostas Frequentes
- [ ] Archivo `src/lib/faqs.ts` creado con tipo `FAQ` y 16 pares Q&A
- [ ] Componente `FAQAssessor.tsx` creado con bloque de pregunta + VoiceAssessor
- [ ] Tab "Preguntas & Respostas" agregado a la pantalla de módulo (condicional)
- [ ] Cards de FAQ en la lista con botón "Practicar" y estado de completado
- [ ] `POST /api/progress` acepta `faqId` como alternativa a `lessonId`
- [ ] Script `generate-faq-audio` creado y ejecutado
- [ ] ~32 archivos MP3 generados en `/public/audio/faq/`
- [ ] `seed-db.ts` ejecutado y verificado

---

## Resumen de contenido agregado en Sprints 3 y 4

| Tipo | Cantidad | Módulos |
|---|---|---|
| Expressões | 31 | M1, M5, M10, M11, M14, M15 |
| Pares FAQ (Q&A) | 16 | M5, M7, M10, M11, M14, M15 |
| Archivos MP3 nuevos | ~63 | expressões (31) + preguntas FAQ (16) + respuestas FAQ (16) |
