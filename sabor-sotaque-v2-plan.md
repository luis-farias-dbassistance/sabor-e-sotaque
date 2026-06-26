# Sabor & Sotaque — Plan de Versión 2.0
**Fecha:** Junio 2026 | **Basado en:** Revisión de contenidos de diseñadora + arquitectura actual

---

## 1. Estado actual (v1 — línea base)

| Métrica | Valor actual |
|---|---|
| Módulos | 13 |
| Lecciones (frases) | 130 (10 por módulo) |
| Categorías | Gastronomía (5), Logística (3), Aventura (5) |
| Mecánica de práctica | Escuchar frase → Grabar → Score Levenshtein ≥ 85% |
| Contenido tipo | Frases aisladas (una por lección) |
| Idiomas trabajados | pt-BR (frase objetivo) + es (traducción) |

---

## 2. Análisis de los documentos de la diseñadora

### Documento 1 — `vocabulario_App.docx`

El documento entrega **siete bloques de contenido**, algunos que enriquecen módulos existentes y otros que proponen territorio nuevo:

| Bloque en el doc | Módulo existente que enriquece | ¿Nuevo módulo? |
|---|---|---|
| Cumprimentos e recepção | M1 – Hospitalidad Cercana | No |
| Perguntas frequentes | M1 – Hospitalidad Cercana | No |
| Atendimento de restaurante | M1/M2/M3/M4 | No |
| Turismo de aventura (Trekking vocab + frases guía + preguntas turista) | M10 – Trekking y Senderismo | No |
| **Emergência no Turismo** (vocabulario + 35+ frases de protocolo) | — | **Sí → M14** |
| **Rafting / Kayak** (vocabulario + instrucciones guía + preguntas turista) | — | **Sí → M15** |
| Hospedagem (vocab + 21 frases cliente + 21 frases recepcionista) | M5 – Alojamiento Turístico | No |
| Agência de viagens / Tour operador (vocabulario extenso + 25 frases agente + 25 frases turista) | M7/M9 | No |

### Documento 2 — `Instrucoes_de_Cabalgata.docx`

Contenido específico para cabalgatas con estructura **instructor → turista**:
- Antes de montar: 5 frases del guía
- Durante la cabalgada: 6 frases del guía
- Preguntas del turista: 7 frases

→ Enriquece directamente **M11 – Cabalgatas**, que actualmente tiene 10 lecciones genéricas.

---

## 3. Gap Analysis: lo que falta vs. lo que hay

### 3.1 Brechas de contenido

**M1 – Hospitalidad Cercana** (actualmente 10 frases)
- El doc agrega: 8 saludos/recepción + 8 FAQ + 5 atención restaurante
- → Expandir a **20 lecciones** o crear sub-lecciones temáticas

**M5 – Alojamiento Turístico** (actualmente 10 frases)
- El doc agrega: 21 frases del turista + 21 frases del recepcionista
- → Expandir a **15–20 lecciones** con perspectiva doble (quién habla)

**M7 – Agencia de Viajes** y **M9 – Tour Operador** (actualmente 10 c/u)
- El doc unifica y expande ambos con vocabulario temático + diálogos
- → Fusionar en una sola categoría enriquecida o reorganizar

**M10 – Trekking y Senderismo** (actualmente 10 frases)
- El doc agrega: 15 palabras vocabulario + 19 frases instructivas + 19 preguntas de turista
- → Expandir a **20 lecciones** con roles diferenciados

**M11 – Cabalgatas** (actualmente 10 frases)
- El doc dedicado agrega: 11 frases de guía + 7 preguntas de turista
- → Expandir a **15 lecciones** con contenido de rol real

### 3.2 Brechas de estructura/mecánica

| Problema detectado | Evidencia en los docs |
|---|---|
| Contenido unidireccional: la app solo enseña qué decir, no cómo responder | Todos los bloques tienen "Frases del Turista" vs "Frases del Guía/Recepcionista" |
| Sin modo vocabulario | Cada bloque tiene secciones "Vocabulário essencial" con 15–25 palabras clave |
| Sin práctica de diálogo | Los docs estructuran intercambios pregunta-respuesta naturales |
| Emergencias no están cubiertos | Bloque "Emergência no Turismo" es extenso (35+ frases) y crítico para el rubro |
| Rafting/Kayak sin cobertura | Bloque completo con vocab + instrucciones + preguntas turista |

---

## 4. Propuesta de estructura v2

### 4.1 Módulos nuevos

**M14 – Emergencias Turísticas** *(Nueva categoría: Seguridad)*
- 10 frases de protocolo de seguridad
- 10 frases de comunicación de emergencia con el turista
- Vocabulario esencial: emergencia, evacuación, rescate, ambulancia, etc.
- Contexto: situaciones críticas en terreno (accidente, caída, clima peligroso)

**M15 – Rafting & Kayak** *(Categoría: Aventura)*
- 8 instrucciones de seguridad del guía
- 7 preguntas típicas del turista
- Vocabulario esencial: colete, corredeira, remo, nivel de dificultad, etc.
- Comandos críticos en pt-BR: "Todos para dentro!", "Remen com força", etc.

### 4.2 Módulos expandidos

| Módulo | Lecciones v1 | Lecciones v2 | Contenido nuevo |
|---|---|---|---|
| M1 – Hospitalidad | 10 | 20 | Saludos, FAQ, atención básica de restaurante |
| M5 – Alojamiento | 10 | 20 | Diálogos check-in/out, amenidades, problemas frecuentes |
| M7 – Agencia de Viajes | 10 | 15 | Frases de cotización, cancelación, confirmación |
| M9 – Tour Operador | 10 | 15 | Frases de logística de grupos, paquetes, personalización |
| M10 – Trekking | 10 | 20 | Instrucciones de seguridad, lecturas del terreno, Q&A turistas |
| M11 – Cabalgatas | 10 | 15 | Instrucciones antes/durante, reacciones a situaciones del turista |

### 4.3 Resumen numérico v2

| Métrica | v1 | v2 |
|---|---|---|
| Módulos | 13 | **15** |
| Total de lecciones (frases) | 130 | **~195** (+50%) |
| Categorías | 3 | **4** (+ Seguridad) |

---

## 5. Nuevas mecánicas propuestas

### 5.1 Modo Diálogo (⭐ Prioridad Alta)

**Qué es:** Par de frases (guía + turista) presentadas como una conversación corta. El usuario practica **una de las dos partes** mientras escucha la otra en audio Polly.

**Por qué:** Todos los documentos de la diseñadora estructuran el contenido en pares. Enseñar la frase aislada pierde el contexto de cuándo usarla.

**Flujo UX:**
```
[Imagen de contexto]
💬 Turista dice:  "Quanto tempo dura a trilha?"     [▶ Audio]
🎤 Tú respondes: _______________________________   [● Grabar]
                                                   [Score 92% ✓]
```

**Implementación:** Nueva propiedad en `lessons.ts`:
```typescript
{
  phrase_pt: "A caminhada dura aproximadamente duas horas.",
  phrase_es: "La caminata dura aproximadamente dos horas.",
  context: "Respuesta a turista que pregunta duración",
  dialogue_trigger_pt: "Quanto tempo dura a trilha?",   // NUEVO
  dialogue_trigger_es: "¿Cuánto tiempo dura la caminata?", // NUEVO
  speaker_role: "guide" // "guide" | "tourist"           // NUEVO
}
```

### 5.2 Modo Vocabulario / Flashcards (⭐ Prioridad Media)

**Qué es:** Antes de las frases de un módulo, el usuario pasa por una pantalla de vocabulario clave (sustantivos, verbos), con audio de pronunciación de cada palabra.

**Por qué:** Los documentos incluyen secciones "Vocabulário essencial" en cada bloque. Son el andamiaje conceptual que falta actualmente.

**Flujo UX:**
```
[M15 – Rafting & Kayak]
Antes de comenzar las frases, aprende estas palabras clave:

colete salva-vidas   [▶]  ←→  chaleco salvavidas
corredeira           [▶]  ←→  rápido
remo                 [▶]  ←→  remo
[Siguiente →]
```

**Dato clave:** Este modo no requiere score — es exposición auditiva pura. Más simple de implementar.

### 5.3 Selector de Rol (Prioridad Media)

**Qué es:** Al entrar a un módulo, el usuario elige si quiere practicar como **Guía/Staff** o como **Turista brasileiro**. El filtro muestra solo las frases del rol elegido.

**Por qué:** Los documentos distinguen claramente las frases que dice cada parte. Un recepcionista no necesita aprender las frases del turista; las necesita *entender*.

**Nota de implementación:** El rol "Turista" podría usarse para **comprensión auditiva**: escuchar la frase en pt-BR y seleccionar qué significa, sin grabar.

### 5.4 Módulo de Emergencias con UX diferenciada (Prioridad Alta)

**Qué es:** M14 tiene un tratamiento visual distinto — fondo rojo oscuro, ícono de alerta, frases ordenadas por prioridad de criticidad.

**Por qué:** En una emergencia real, el trabajador necesita recordar exactamente estas frases. El contexto emocional del diseño refuerza la memorización. No es gastronomía — es seguridad.

---

## 6. Ajustes de arquitectura técnica requeridos

### 6.1 Cambios en `src/lib/lessons.ts`

```typescript
// Nuevas propiedades por lección
interface Lesson {
  id: string;
  moduleId: string;
  phrase_pt: string;
  phrase_es: string;
  context: string;
  imageUrl: string;
  // NUEVAS PROPIEDADES v2:
  dialogue_trigger_pt?: string;    // Frase del interlocutor que dispara la respuesta
  dialogue_trigger_es?: string;
  speaker_role?: "guide" | "tourist" | "receptionist" | "agent";
  vocabulary?: VocabularyItem[];   // Vocabulario previo del módulo
  difficulty?: "básico" | "intermedio" | "avanzado"; // Para progresión
}

interface VocabularyItem {
  word_pt: string;
  word_es: string;
  audioFile?: string; // Generado por Polly
}
```

### 6.2 Nuevos módulos en la estructura de datos

```typescript
// Nuevos módulos a agregar:
{ id: "m14", name: "Emergencias Turísticas", category: "seguridad", emoji: "🚨" }
{ id: "m15", name: "Rafting & Kayak", category: "aventura", emoji: "🚣" }

// Nueva categoría en FlavorMap:
{ id: "seguridad", label: "Seguridad", icon: "⛑️" }
```

### 6.3 Comandos de actualización (AGENTS.md)

```bash
# Tras actualizar lessons.ts:
npx tsx scripts/seed-db.ts           # Sincronizar DynamoDB
npm run generate-audio               # Generar MP3 de frases nuevas
npm run generate-vocab-audio         # NUEVO: generar MP3 de vocabulario
```

### 6.4 Nuevas rutas/pantallas

| Ruta | Descripción |
|---|---|
| `/lesson/[id]/vocab` | Pantalla de vocabulario previo del módulo |
| `/lesson/[id]/dialogue` | Modo diálogo (nueva mecánica) |

---

## 7. Nuevas lecciones — contenido mapeado

### M14 – Emergencias Turísticas (10 lecciones iniciales)

| # | Frase pt-BR | Traducción es | Contexto |
|---|---|---|---|
| 1 | Por favor, mantenham a calma. | Por favor, mantengan la calma. | Inicio de protocolo de emergencia |
| 2 | Sigam as instruções do guia turístico. | Sigan las instrucciones del guía turístico. | Evacuación o incidente |
| 3 | A saída de emergência fica aqui. | La salida de emergencia está aquí. | Señalización in situ |
| 4 | Não se afastem do grupo. | No se alejen del grupo. | Control de grupo en terreno |
| 5 | Precisamos evacuar a área. | Necesitamos evacuar el área. | Emergencia activa |
| 6 | A ambulância está chegando. | La ambulancia está llegando. | Comunicación tras llamada de emergencia |
| 7 | Precisa de ajuda médica? | ¿Necesita ayuda médica? | Evaluación inicial de lesionado |
| 8 | O guia está verificando a situação. | El guía está verificando la situación. | Gestión de espera del grupo |
| 9 | O clima está perigoso para o passeio. | El clima está peligroso para el paseo. | Cancelación por condiciones |
| 10 | Esperem aqui até novas instruções. | Esperen aquí hasta nuevas instrucciones. | Punto de reunión |

### M15 – Rafting & Kayak (10 lecciones iniciales)

| # | Frase pt-BR | Traducción es | Contexto |
|---|---|---|---|
| 1 | Por favor, vistam o colete salva-vidas e ajustem bem. | Por favor, pónganse el chaleco salvavidas y ajústenlo bien. | Equipo pre-actividad |
| 2 | Coloquem o capacete e apertem a fivela, é obrigatório. | Pónganse el casco y abrochen la hebilla, es obligatorio. | Equipo pre-actividad |
| 3 | Quando eu disser "frente", remem com força para a frente. | Cuando diga "adelante", remen con fuerza hacia adelante. | Comando de remo |
| 4 | Quando eu disser "trás", remem para trás em sincronia. | Cuando diga "atrás", remen hacia atrás en sincronía. | Comando de remo |
| 5 | Segurem firme na corda interna do bote. | Sujétense fuerte de la cuerda interna de la balsa. | Instrucción de seguridad |
| 6 | Todos para dentro! | ¡Todos adentro! | Comando crítico de emergencia |
| 7 | Prestem muita atenção aos meus comandos. | Presten mucha atención a mis comandos. | Inicio de descenso |
| 8 | O passeio é seguro. Não é necessário saber nadar. | El paseo es seguro. No es necesario saber nadar. | Respuesta a pregunta del turista |
| 9 | A água é muito fria, recomendamos roupa de neoprene. | El agua es muy fría, recomendamos traje de neopreno. | Preparación del turista |
| 10 | Quanto tempo dura a descida no rio? | ¿Cuánto tiempo dura la bajada en el río? | Pregunta frecuente del turista |

### M11 – Cabalgatas (lecciones adicionales, de 10 → 15)

| # | Frase pt-BR | Traducción es | Contexto |
|---|---|---|---|
| 11 | Por favor, usem o capacete durante todo o passeio. É obrigatório. | Por favor, usen el casco durante todo el paseo. Es obligatorio. | Instrucción antes de montar |
| 12 | Para montar, coloque o pé esquerdo no estribo e impulsione-se para cima. | Para montar, coloque el pie izquierdo en el estribo e impulse hacia arriba. | Instrucción de montaje |
| 13 | Mantenham uma distância segura do cavalo da frente. | Mantengan una distancia segura del caballo de adelante. | Seguridad durante la cabalgata |
| 14 | Se o cavalo começar a trotar e você se sentir inseguro, puxe as rédeas suavemente. | Si el caballo empieza a trotar y te sientes inseguro, jala las riendas suavemente. | Reacción a imprevisto |
| 15 | Não gritem ou façam movimentos bruscos, isso pode assustar os cavalos. | No griten ni hagan movimientos bruscos, esto puede asustar a los caballos. | Norma de comportamiento |

---

## 8. Roadmap de implementación

### Sprint 1 — Contenido (1–2 semanas)
- [ ] Actualizar `lessons.ts` con M14 y M15 (20 frases nuevas)
- [ ] Expandir M11 de 10 a 15 lecciones
- [ ] Expandir M10 de 10 a 20 lecciones con frases del documento
- [ ] Ejecutar `seed-db.ts` + `generate-audio`
- [ ] Verificar en staging que los nuevos módulos aparecen correctamente en FlavorMap

### Sprint 2 — Vocabulario (1 semana)
- [ ] Definir estructura de datos `VocabularyItem[]` en `lessons.ts`
- [ ] Mapear vocabulario esencial de los docs a cada módulo afectado
- [ ] Crear pantalla `/lesson/[id]/vocab` (flashcards de vocabulario)
- [ ] Agregar script `generate-vocab-audio` para las palabras nuevas
- [ ] Integrar botón "Vocabulario" en la pantalla de módulo antes de las lecciones

### Sprint 3 — Modo Diálogo (2–3 semanas)
- [ ] Agregar propiedades `dialogue_trigger_pt/es` y `speaker_role` en `lessons.ts`
- [ ] Crear componente `DialogueAssessor` (variante de `VoiceAssessor`)
- [ ] Mostrar frase del interlocutor + reproducir audio automáticamente
- [ ] Permitir al usuario grabar la respuesta y obtener score
- [ ] Seleccionar qué lecciones de M10, M11, M14, M15 son modo diálogo

### Sprint 4 — Selector de Rol + Nueva categoría Seguridad (1 semana)
- [ ] Agregar tab "Seguridad" en `FlavorMap` (junto a Gastronomía / Logística / Aventura)
- [ ] Asignar M14 a la nueva categoría Seguridad
- [ ] Agregar filtro de rol en la pantalla de módulo (toggle Guía / Turista)
- [ ] Diseño visual diferenciado para M14 (paleta de emergencia)

### Sprint 5 — Expansión de M1, M5, M7, M9 (1–2 semanas)
- [ ] M1: +10 lecciones (saludos + FAQ + restaurante básico)
- [ ] M5: +10 lecciones (frases de recepcionista + problemas frecuentes)
- [ ] M7/M9: +5 lecciones c/u (frases de agente + confirmación de reservas)
- [ ] Ejecutar `seed-db.ts` + `generate-audio`

---

## 9. Resumen ejecutivo para compartir con la diseñadora

Los documentos entregados son sólidos y cubren con precisión los vacíos más críticos del contenido actual. Las principales conclusiones:

**Qué se incorpora directamente:**
- 2 módulos nuevos completos (Emergencias, Rafting/Kayak)
- Expansión de 6 módulos existentes (+65 lecciones netas)
- Vocabulario esencial para cada área temática

**Qué el contenido inspira como nueva mecánica:**
- Modo Diálogo: practicar respuestas en contexto real de conversación
- Flashcards de vocabulario: paso previo antes de las frases
- Selector de rol: diferenciar guía/staff de turista

**Lo que la v2 no cambia:**
- Stack técnico (Next.js, AWS, Polly, Levenshtein)
- Flujo base de aprendizaje (escuchar → grabar → score)
- Diseño visual dark/amber (solo se agrega paleta de emergencia para M14)
