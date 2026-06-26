require('ts-node').register({ transpileOnly: true });
const path = require('path');
const lessonsModule = require(path.resolve(__dirname, '../src/lib/lessons.ts'));
const INITIAL_DATA = lessonsModule.INITIAL_DATA;

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const protocol = url.startsWith('https') ? require('https') : require('http');
    const result = await new Promise((resolve, reject) => {
      const req = protocol.get(url, { signal: controller.signal }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', reject);
    });
    return result;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function validate() {
  const lessons = [];
  for (const modKey in INITIAL_DATA) {
    const mod = INITIAL_DATA[modKey];
    if (Array.isArray(mod.lessons)) {
      lessons.push(...mod.lessons);
    }
  }
  const results = await Promise.allSettled(
    lessons.map(async (lesson) => {
      if (!lesson.imageUrl) return { id: lesson.id, status: 'missing', url: undefined };
      const ok = await fetchWithTimeout(lesson.imageUrl);
      return { id: lesson.id, status: ok ? 'valid' : 'broken', url: lesson.imageUrl };
    })
  );
  const broken = results.filter(r => r.status === 'fulfilled' && r.value.status !== 'valid').map(r => r.value);
  if (broken.length === 0) {
    console.log('✅ All lesson images are valid (HTTP 200)');
  } else {
    console.log('❌ Broken or missing image URLs:');
    broken.forEach(({ id, status, url }) => {
      console.log(`  - Lesson "${id}": ${status === 'missing' ? 'No imageUrl defined' : `Broken URL: ${url}`}`);
    });
    process.exit(1);
  }
}

validate().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
