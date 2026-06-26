#!/usr/bin/env node

/**
 * Pre-generate audio files for all lesson phrases using Amazon Polly.
 * Stores MP3 files in S3 under /audio/ prefix.
 * 
 * Usage: node scripts/generate-audio.js
 * 
 * Cost: ~$0.004 per phrase (Neural voice) = ~$0.16 for 40 phrases
 */

const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

const REGION = 'us-east-1';
const polly = new PollyClient({ region: REGION });
const s3 = new S3Client({ region: REGION });

// Get bucket name from CloudFormation stack
async function getBucketName() {
  try {
    const { CloudFormationClient, DescribeStacksCommand } = require('@aws-sdk/client-cloudformation');
    const cf = new CloudFormationClient({ region: REGION });
    const result = await cf.send(new DescribeStacksCommand({ StackName: 'sabor-sotaque-frontend' }));
    const output = result.Stacks[0].Outputs.find(o => o.OutputKey === 'BucketName');
    return output.OutputValue;
  } catch (err) {
    console.warn(`  ⚠️  No se pudo obtener el bucket S3 (¿sesión expirada o sin desplegar?): ${err.message}`);
    return null;
  }
}

const fs = require('fs');
const path = require('path');

function hashPhrase(phrase) {
  return crypto.createHash('md5').update(phrase.toLowerCase().trim()).digest('hex');
}

function getPhrasesFromLessons() {
  const filePath = path.join(__dirname, '../src/lib/lessons.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const phrases = [];
  
  for (const line of lines) {
    const match = line.match(/phrase_pt:\s*(["'])/);
    if (match) {
      const quoteChar = match[1];
      const startIndex = line.indexOf('phrase_pt:') + 'phrase_pt:'.length;
      const contentStart = line.indexOf(quoteChar, startIndex) + 1;
      
      let contentEnd = -1;
      for (let i = contentStart; i < line.length; i++) {
        if (line[i] === quoteChar && line[i - 1] !== '\\') {
          contentEnd = i;
          break;
        }
      }
      
      if (contentEnd !== -1) {
        const phrase = line.substring(contentStart, contentEnd);
        const unescaped = phrase
          .replace(new RegExp('\\\\' + quoteChar, 'g'), quoteChar)
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'");
        phrases.push(unescaped);
      }
    }
  }
  return [...new Set(phrases)]; // deduplicate
}

const PHRASES = getPhrasesFromLessons();

async function synthesize(phrase) {
  let result;
  try {
    result = await polly.send(new SynthesizeSpeechCommand({
      Engine: 'generative',
      LanguageCode: 'pt-BR',
      OutputFormat: 'mp3',
      Text: phrase,
      VoiceId: 'Camila', // Best pt-BR voice supporting generative engine
      TextType: 'text',
    }));
  } catch (generativeErr) {
    console.warn(`  ⚠️  Generative engine failed, falling back to neural: ${generativeErr.message}`);
    result = await polly.send(new SynthesizeSpeechCommand({
      Engine: 'neural',
      LanguageCode: 'pt-BR',
      OutputFormat: 'mp3',
      Text: phrase,
      VoiceId: 'Camila',
      TextType: 'text',
    }));
  }

  // Convert stream to buffer
  const chunks = [];
  for await (const chunk of result.AudioStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function audioExistsInS3(bucket, key) {
  if (!bucket) return false;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getVocabFromLessons() {
  const filePath = path.join(__dirname, '../src/lib/lessons.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract vocabulary blocks: vocabulary: [ { word_pt: "...", word_es: "..." }, ... ]
  const vocab = {}; // { moduleId: [ { word_pt, word_es } ] }

  // Find module IDs and their vocabulary sections
  const moduleMatches = [...content.matchAll(/"([\w\d]+)":\s*\{[^}]*?id:\s*"([\w\d]+)"[^}]*?vocabulary:\s*\[([\s\S]*?)\]/g)];
  
  // Alternative: parse per module block
  const moduleBlocks = content.split(/(?="m?\d+"\s*:)/);
  
  for (const block of moduleBlocks) {
    const idMatch = block.match(/id:\s*"([\w-]+)"/);
    if (!idMatch) continue;
    const moduleId = idMatch[1];

    // Find vocabulary array in this block
    const vocabMatch = block.match(/vocabulary:\s*\[([\s\S]*?)\]/);
    if (!vocabMatch) continue;

    const vocabContent = vocabMatch[1];
    const wordMatches = [...vocabContent.matchAll(/word_pt:\s*"([^"]+)"/g)];
    
    if (wordMatches.length > 0) {
      vocab[moduleId] = wordMatches.map(m => m[1]);
    }
  }

  return vocab;
}

async function main() {
  const bucket = await getBucketName();
  const audioDir = path.join(__dirname, '../public/audio');
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  console.log(`\n🎙️  Amazon Polly — Pre-generación de Audio`);
  console.log(`📂 Directorio Local: public/audio`);
  console.log(`📦 Bucket S3: ${bucket || 'No disponible'}`);
  console.log(`🗣️  Voz: Camila (Generative pt-BR)`);
  console.log(`📝 Frases: ${PHRASES.length}\n`);

  let generated = 0;
  let skipped = 0;

  // ── 1. Generate phrase audio ──────────────────────────────────────────────
  for (const phrase of PHRASES) {
    const hash = hashPhrase(phrase);
    const filename = `${hash}.mp3`;
    const localPath = path.join(audioDir, filename);
    const key = `audio/${filename}`;
    const shortPhrase = phrase.substring(0, 50) + (phrase.length > 50 ? '...' : '');

    if (fs.existsSync(localPath)) {
      console.log(`  ⏭️  [existe local] ${shortPhrase}`);
      skipped++;
      continue;
    }

    try {
      const audioBuffer = await synthesize(phrase);
      fs.writeFileSync(localPath, audioBuffer);
      console.log(`  ✅ [Guardado Local - ${(audioBuffer.length / 1024).toFixed(1)}KB] ${shortPhrase}`);
      
      if (bucket) {
        try {
          await s3.send(new PutObjectCommand({
            Bucket: bucket, Key: key, Body: audioBuffer,
            ContentType: 'audio/mpeg', CacheControl: 'max-age=31536000',
          }));
          console.log(`     📤 Subido a S3: ${key}`);
        } catch (s3Err) {
          console.error(`     ⚠️  Error subiendo a S3: ${s3Err.message}`);
        }
      }
      generated++;
    } catch (err) {
      console.error(`  ❌ Error sintetizando: ${shortPhrase} — ${err.message}`);
    }
  }

  // ── 2. Generate vocabulary audio ──────────────────────────────────────────
  console.log(`\n📚 Generando audio de vocabulario...\n`);
  const vocabData = getVocabFromLessons();
  const vocabManifest = {};
  let vocabGenerated = 0;
  let vocabSkipped = 0;

  for (const [moduleId, words] of Object.entries(vocabData)) {
    const vocabDir = path.join(audioDir, 'vocab', moduleId);
    if (!fs.existsSync(vocabDir)) {
      fs.mkdirSync(vocabDir, { recursive: true });
    }
    vocabManifest[moduleId] = {};

    for (const word of words) {
      const slug = slugify(word);
      const filename = `${slug}.mp3`;
      const localPath = path.join(vocabDir, filename);
      const relativePath = `/audio/vocab/${moduleId}/${filename}`;
      const s3Key = `audio/vocab/${moduleId}/${filename}`;

      vocabManifest[moduleId][word] = relativePath;

      if (fs.existsSync(localPath)) {
        console.log(`  ⏭️  [vocab existe] ${moduleId}/${word}`);
        vocabSkipped++;
        continue;
      }

      try {
        const audioBuffer = await synthesize(word);
        fs.writeFileSync(localPath, audioBuffer);
        console.log(`  ✅ [vocab generado] ${moduleId}/${word}`);

        if (bucket) {
          try {
            await s3.send(new PutObjectCommand({
              Bucket: bucket, Key: s3Key, Body: audioBuffer,
              ContentType: 'audio/mpeg', CacheControl: 'max-age=31536000',
            }));
          } catch (s3Err) {
            console.error(`     ⚠️  Error vocab S3: ${s3Err.message}`);
          }
        }
        vocabGenerated++;
      } catch (err) {
        console.error(`  ❌ Error vocab: ${word} — ${err.message}`);
      }
    }
  }

  // ── 3. Write updated manifest ─────────────────────────────────────────────
  const phraseManifest = {};
  for (const phrase of PHRASES) {
    phraseManifest[hashPhrase(phrase)] = phrase;
  }

  const fullManifest = { phrases: phraseManifest, vocabulary: vocabManifest };
  const manifestPath = path.join(audioDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(fullManifest, null, 2));
  console.log(`  ✅ Manifiesto guardado: public/audio/manifest.json`);

  if (bucket) {
    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucket, Key: 'audio/manifest.json',
        Body: JSON.stringify(fullManifest, null, 2), ContentType: 'application/json',
      }));
      console.log(`  📤 Manifiesto subido a S3`);
    } catch (s3Err) {
      console.error(`  ⚠️  Error subiendo manifiesto: ${s3Err.message}`);
    }
  }

  console.log(`\n================================================`);
  console.log(`  Frases — ✅ Generadas: ${generated}  ⏭️  Existían: ${skipped}`);
  console.log(`  Vocab  — ✅ Generadas: ${vocabGenerated}  ⏭️  Existían: ${vocabSkipped}`);
  console.log(`  💰 Costo estimado Polly: ~$${((generated + vocabGenerated) * 0.004).toFixed(2)}`);
  console.log(`================================================\n`);
}

main().catch(console.error);

