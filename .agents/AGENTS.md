# Reglas del Proyecto — Sabor & Sotaque

## 🔊 REGLA CRÍTICA: Audio siempre con AWS Polly

**NUNCA usar la Web Speech API (speechSynthesis, SpeechSynthesisUtterance) para pronunciar frases o vocabulario.**

Toda reproducción de audio en esta app DEBE usar los archivos MP3 pre-generados por AWS Polly y servidos desde S3/CloudFront, consultando el manifest en `/audio/manifest.json`.

- Si un audio no está en el manifest → mostrar un spinner/carga, **nunca** reproducir voz del sistema.
- El label en la UI debe ser siempre "🎙️ Voz Polly (pt-BR)" cuando esté listo.
- El label "🔊 Voz del sistema" no debe aparecer jamás en producción.
- Esto aplica a: `VoiceAssessor.tsx`, `VocabClient.tsx`, y cualquier componente que reproduzca audio.

## 📋 Procedimientos de contenido

Cuando se agreguen o modifiquen frases en `src/lib/lessons.ts`, SIEMPRE:
1. Sincronizar con DynamoDB: `npx tsx scripts/seed-db.ts`
2. Generar audios Polly: `npm run generate-audio`
