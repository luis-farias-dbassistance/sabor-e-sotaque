/*
  validate-images.js
  Simple script to verify that each lesson's imageUrl returns HTTP 200.
  Run with: node scripts/validate-images.js
*/
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

function fetchWithTimeout(url, timeout = 5000) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const timer = setTimeout(() => {
      // abort request after timeout
      req.destroy();
      resolve(false);
    }, timeout);
    const req = lib.get(url, (res) => {
      clearTimeout(timer);
      resolve(res.statusCode === 200);
    });
    req.on('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

(async () => {
  const lessonsPath = path.resolve(__dirname, '../src/lib/lessons.ts');
  // Import the TS file via dynamic import (needs ts-node) – fallback to parsing manually
  // Instead, read the file and extract INITIAL_DATA via regex (simple approach)
  const fileContent = fs.readFileSync(lessonsPath, 'utf-8');
  const match = fileContent.match(/export const INITIAL_DATA:.*?=\s*(\{[\s\S]*?\});/);
  if (!match) {
    console.error('Could not parse INITIAL_DATA');
    process.exit(1);
  }
  const dataObj = eval('(' + match[1] + ')'); // eval is safe here as file is trusted
  const lessons = [];
  Object.values(dataObj).forEach((mod) => {
    if (Array.isArray(mod.lessons)) lessons.push(...mod.lessons);
  });

  const results = await Promise.allSettled(
    lessons.map(async (lesson) => {
      if (!lesson.imageUrl) return { id: lesson.id, status: 'missing' };
      const ok = await fetchWithTimeout(lesson.imageUrl);
      return { id: lesson.id, status: ok ? 'valid' : 'broken', url: lesson.imageUrl };
    })
  );

  const broken = results
    .filter((r) => r.status === 'fulfilled' && r.value.status !== 'valid')
    .map((r) => r.value);

  if (broken.length === 0) {
    console.log('✅ All lesson images are valid (HTTP 200)');
    process.exit(0);
  }
  console.log('❌ Broken or missing image URLs:');
  broken.forEach(({ id, status, url }) => {
    console.log(`  - Lesson "${id}": ${status === 'missing' ? 'No imageUrl defined' : `Broken URL: ${url}`}`);
  });
  process.exit(1);
})();
