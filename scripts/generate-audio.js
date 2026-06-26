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

async function main() {
  const bucket = await getBucketName();
  const audioDir = path.join(__dirname, '../public/audio');
  
  // Ensure local output directory exists
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

  for (const phrase of PHRASES) {
    const hash = hashPhrase(phrase);
    const filename = `${hash}.mp3`;
    const localPath = path.join(audioDir, filename);
    const key = `audio/${filename}`;
    const shortPhrase = phrase.substring(0, 50) + (phrase.length > 50 ? '...' : '');

    // Skip if already exists locally
    if (fs.existsSync(localPath)) {
      console.log(`  ⏭️  [existe local] ${shortPhrase}`);
      skipped++;
      continue;
    }

    try {
      const audioBuffer = await synthesize(phrase);
      
      // Save locally
      fs.writeFileSync(localPath, audioBuffer);
      console.log(`  ✅ [Guardado Local - ${(audioBuffer.length / 1024).toFixed(1)}KB] ${shortPhrase}`);
      
      // Upload to S3 if bucket is available
      if (bucket) {
        try {
          await s3.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: audioBuffer,
            ContentType: 'audio/mpeg',
            CacheControl: 'max-age=31536000', // 1 year cache
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

  // Generate the audio manifest (hash → phrase mapping)
  const manifest = {};
  for (const phrase of PHRASES) {
    manifest[hashPhrase(phrase)] = phrase;
  }
  
  const manifestPath = path.join(audioDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  ✅ Manifiesto guardado en local: public/audio/manifest.json`);

  if (bucket) {
    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: 'audio/manifest.json',
        Body: JSON.stringify(manifest, null, 2),
        ContentType: 'application/json',
      }));
      console.log(`  📤 Manifiesto subido a S3`);
    } catch (s3Err) {
      console.error(`  ⚠️  Error subiendo manifiesto a S3: ${s3Err.message}`);
    }
  }

  console.log(`\n================================================`);
  console.log(`  ✅ Generados: ${generated}`);
  console.log(`  ⏭️  Ya existían: ${skipped}`);
  console.log(`  💰 Costo estimado Polly: ~$${(generated * 0.004).toFixed(2)}`);
  console.log(`================================================\n`);
}

main().catch(console.error);
