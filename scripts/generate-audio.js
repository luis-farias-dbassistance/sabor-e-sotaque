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
  const { CloudFormationClient, DescribeStacksCommand } = require('@aws-sdk/client-cloudformation');
  const cf = new CloudFormationClient({ region: REGION });
  const result = await cf.send(new DescribeStacksCommand({ StackName: 'sabor-sotaque-frontend' }));
  const output = result.Stacks[0].Outputs.find(o => o.OutputKey === 'BucketName');
  return output.OutputValue;
}

const fs = require('fs');
const path = require('path');

function hashPhrase(phrase) {
  return crypto.createHash('md5').update(phrase.toLowerCase().trim()).digest('hex');
}

function getPhrasesFromLessons() {
  const filePath = path.join(__dirname, '../src/lib/lessons.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  const phrases = [];
  const regex = /phrase_pt:\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    // Replace escape sequences if any
    phrases.push(match[1].replace(/\\"/g, '"').replace(/\\'/g, "'"));
  }
  return [...new Set(phrases)]; // deduplicate
}

const PHRASES = getPhrasesFromLessons();


async function synthesize(phrase) {
  const result = await polly.send(new SynthesizeSpeechCommand({
    Engine: 'neural',
    LanguageCode: 'pt-BR',
    OutputFormat: 'mp3',
    Text: phrase,
    VoiceId: 'Camila', // Best female pt-BR neural voice
    TextType: 'text',
  }));

  // Convert stream to buffer
  const chunks = [];
  for await (const chunk of result.AudioStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function audioExists(bucket, key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const bucket = await getBucketName();
  console.log(`\n🎙️  Amazon Polly — Pre-generación de Audio`);
  console.log(`📦 Bucket: ${bucket}`);
  console.log(`🗣️  Voz: Camila (Neural pt-BR)`);
  console.log(`📝 Frases: ${PHRASES.length}\n`);

  let generated = 0;
  let skipped = 0;

  for (const phrase of PHRASES) {
    const hash = hashPhrase(phrase);
    const key = `audio/${hash}.mp3`;
    const shortPhrase = phrase.substring(0, 50) + (phrase.length > 50 ? '...' : '');

    // Skip if already exists
    if (await audioExists(bucket, key)) {
      console.log(`  ⏭️  [existe] ${shortPhrase}`);
      skipped++;
      continue;
    }

    try {
      const audioBuffer = await synthesize(phrase);
      
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: audioBuffer,
        ContentType: 'audio/mpeg',
        CacheControl: 'max-age=31536000', // 1 year cache
      }));

      console.log(`  ✅ [${(audioBuffer.length / 1024).toFixed(1)}KB] ${shortPhrase}`);
      generated++;
    } catch (err) {
      console.error(`  ❌ Error: ${shortPhrase} — ${err.message}`);
    }
  }

  // Generate the audio manifest (hash → phrase mapping)
  const manifest = {};
  for (const phrase of PHRASES) {
    manifest[hashPhrase(phrase)] = phrase;
  }
  
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: 'audio/manifest.json',
    Body: JSON.stringify(manifest, null, 2),
    ContentType: 'application/json',
  }));

  console.log(`\n================================================`);
  console.log(`  ✅ Generados: ${generated}`);
  console.log(`  ⏭️  Ya existían: ${skipped}`);
  console.log(`  💰 Costo estimado: ~$${(generated * 0.004).toFixed(2)}`);
  console.log(`================================================\n`);
}

main().catch(console.error);
