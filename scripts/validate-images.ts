import { promises as fs } from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

interface Lesson {
  id: string;
  title?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

async function fetchWithTimeout(url: string, timeout = 5000): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const protocol = url.startsWith('https') ? https : http;
    const response = await new Promise<boolean>((resolve, reject) => {
      const req = protocol.get(url, { signal: controller.signal as any }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', reject);
      req.end();
    });
    return response;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function validateLessonImages(): Promise<void> {
  const filePath = path.resolve('/Users/lfarias/Kiro/sabor-sotaque/src/lib/lessons.ts');
  const modulePath = `file://${filePath}?t=${Date.now()}`;
  const { INITIAL_DATA }: { INITIAL_DATA: Record<string, any> } = await import(modulePath);

  const lessons: Lesson[] = [];
  Object.values(INITIAL_DATA).forEach((mod: any) => {
    if (Array.isArray(mod.lessons)) {
      lessons.push(...mod.lessons);
    }
  });

  const results = await Promise.allSettled(
    lessons.map(async (lesson) => {
      if (!lesson.imageUrl) {
        return { id: lesson.id, status: 'missing' as const, url: undefined };
      }
      const isValid = await fetchWithTimeout(lesson.imageUrl);
      return { id: lesson.id, status: isValid ? 'valid' as const : 'broken' as const, url: lesson.imageUrl };
    })
  );

  const broken = results
    .filter((r) => r.status === 'fulfilled' && (r as any).value.status !== 'valid')
    .map((r) => (r as any).value);

  if (broken.length === 0) {
    console.log('✅ All lesson images are valid (HTTP 200)');
    return;
  }

  console.log('❌ Broken or missing image URLs:');
  broken.forEach(({ id, status, url }) => {
    console.log(`  - Lesson "${id}": ${status === 'missing' ? 'No imageUrl defined' : `Broken URL: ${url}`}`);
  });
  process.exit(1);
}

validateLessonImages().catch((err) => {
  console.error('Validation failed:', err);
  process.exit(1);
});
