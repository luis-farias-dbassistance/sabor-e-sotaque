/**
 * Tests for INITIAL_DATA integrity
 * Validates that all modules and lessons have correct structure
 */
import { INITIAL_DATA } from '@/lib/lessons';

describe('Lesson Data Integrity', () => {
  const moduleIds = Object.keys(INITIAL_DATA);

  test('should have exactly 13 modules', () => {
    expect(moduleIds).toHaveLength(13);
    expect(moduleIds).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']);
  });

  test.each(moduleIds)('module "%s" should have required fields', (id) => {
    const mod = INITIAL_DATA[id];
    expect(mod).toBeDefined();
    expect(mod.id).toBe(id);
    expect(mod.title).toBeTruthy();
    expect(mod.subtitle).toBeTruthy();
    expect(['gastronomy', 'logistics', 'adventure']).toContain(mod.category);
    expect(Array.isArray(mod.lessons)).toBe(true);
  });

  test.each(moduleIds)('module "%s" should have at least 10 lessons', (id) => {
    expect(INITIAL_DATA[id].lessons.length).toBeGreaterThanOrEqual(10);
  });

  test('every lesson should have all required fields', () => {
    for (const mod of Object.values(INITIAL_DATA)) {
      for (const lesson of mod.lessons) {
        expect(lesson.id).toBeTruthy();
        expect(lesson.phrase_pt).toBeTruthy();
        expect(lesson.phrase_es).toBeTruthy();
        expect(lesson.context).toBeTruthy();
        expect(lesson.imageUrl).toBeTruthy();
      }
    }
  });

  test('every lesson ID should be unique across all modules', () => {
    const allIds: string[] = [];
    for (const mod of Object.values(INITIAL_DATA)) {
      for (const lesson of mod.lessons) {
        allIds.push(lesson.id);
      }
    }
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  test('lesson IDs should follow "{moduleId}-{n}" pattern', () => {
    for (const [moduleId, mod] of Object.entries(INITIAL_DATA)) {
      for (const lesson of mod.lessons) {
        expect(lesson.id).toMatch(new RegExp(`^${moduleId}-\\d+$`));
      }
    }
  });

  test('Portuguese phrases should contain Portuguese-specific characters', () => {
    const allPhrases = Object.values(INITIAL_DATA).flatMap(m => m.lessons.map(l => l.phrase_pt));
    const hasPortugueseChars = allPhrases.some(p => /[ãõçéêáàâíúûü]/i.test(p));
    expect(hasPortugueseChars).toBe(true);
  });

  test('every imageUrl should reference a valid image file or unsplash URL', () => {
    for (const mod of Object.values(INITIAL_DATA)) {
      for (const lesson of mod.lessons) {
        expect(lesson.imageUrl).toMatch(/^(\/images\/\w+\.(avif|png|jpg)|https:\/\/images\.unsplash\.com\/photo-\w+.+)$/);
      }
    }
  });

  test('module 1 should be Hospitalidad Cercana', () => {
    expect(INITIAL_DATA['1'].title).toBe('Hospitalidad Cercana');
  });

  test('module 2 should be Maestría Parrillera', () => {
    expect(INITIAL_DATA['2'].title).toBe('Maestría Parrillera');
  });

  test('total lessons should be exactly 130', () => {
    const total = Object.values(INITIAL_DATA).reduce((sum, mod) => sum + mod.lessons.length, 0);
    expect(total).toBe(130);
  });
});
