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

function hashPhrase(phrase) {
  return crypto.createHash('md5').update(phrase.toLowerCase().trim()).digest('hex');
}

// All lesson phrases from the app
const PHRASES = [
  // Module 1: Hospitalidad Cercana
  "Sejam bem-vindos! Fiquem à vontade.",
  "Mesa para quantos? Gostariam de uma mesa interna ou no terraço?",
  "O meu nome é João, serei o seu garçom hoje.",
  "Posso trazer o cardápio ou gostariam de ver o QR code?",
  "Aceitam algo para beber enquanto decidem o prato?",
  "Desejam água com ou sem gás? Com gelo e limão?",
  "Por aqui, por favor. Acompanhem-me.",
  "Estão celebrando alguma ocasião especial hoje?",
  "Qualquer coisa que precisarem, é só me chamar.",
  "Tenham um excelente jantar e desfrutem da comida.",
  
  // Module 2: Maestría Parrillera
  "O Lomo Vetado é o nosso Contrafilé, muito suculento.",
  "A Punta de Ganso é a famosa Picanha brasileira.",
  "Como gostariam do ponto da carne?",
  "Mal passado: a carne fica bem vermelha e suculenta no centro.",
  "Ao ponto: rosada no centro, o ponto mais pedido.",
  "Bem passado: totalmente cozida, sem partes rosadas.",
  "Desejam o Lomo Liso ou o Lomo Vetado? O Vetado tem mais gordura.",
  "Os acompanhamentos são à parte ou prefere um prato combinado?",
  "Esta carne é maturada por vinte e um dias.",
  "Recomendo a nossa Parrillada para compartilhar.",
  
  // Module 3: Clásicos del Campo
  "Cuidado com o caroço na empanada de pino.",
  "O Pastel de Choclo é feito com milho fresco moído.",
  "As Humitas são cozidas na própria palha do milho.",
  "O pino é uma mistura de carne picada, cebola e temperos.",
  "Gostariam de adicionar açúcar ou tomate no Pastel de Choclo?",
  "A Cazuela é uma sopa tradicional com carne e legumes.",
  "O Porotos con Riendas leva feijão e macarrão espaguete.",
  "Acompanha uma taça de vinho tinto da casa?",
  "Este prato é servido em uma tigela de greda quente.",
  "Desejam o molho pebre? É um pouco picante.",
  
  // Module 4: Sandwichería y Mar
  "O Chacarero é um sanduíche de carne com feijão verde.",
  "O Barros Luco leva carne grelhada e queijo derretido.",
  "O Mariscal é um mix de mariscos crus com limão e cebola.",
  "Temos Machas à Parmesana, são gratinadas com queijo.",
  "O Congro Frito é o peixe mais tradicional do Chile.",
  "Gostariam de pão com manteiga enquanto esperam?",
  "O Caldillo de Congrio é uma sopa de peixe muito rica.",
  "Temos cervejas artesanais chilenas muito boas.",
  "O sanduíche é servido em pão frica ou marraqueta?",
  "Desejam maionese caseira? É a nossa especialidade.",
];

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
