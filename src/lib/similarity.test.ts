/**
 * Tests for the Levenshtein-based similarity algorithm
 * Critical for pronunciation assessment accuracy
 */

import { calculateSimilarity } from './similarity';

describe('Pronunciation Similarity Algorithm', () => {
  // === Exact Matches ===
  describe('exact matches', () => {
    test('identical strings should return 1.0', () => {
      expect(calculateSimilarity('hello', 'hello')).toBe(1.0);
    });

    test('identical Portuguese phrases should return 1.0', () => {
      expect(calculateSimilarity(
        'Sejam bem-vindos! Fiquem à vontade.',
        'Sejam bem-vindos! Fiquem à vontade.'
      )).toBe(1.0);
    });

    test('empty strings should return 1.0', () => {
      expect(calculateSimilarity('', '')).toBe(1.0);
    });
  });

  // === Case and Punctuation Insensitivity ===
  describe('case and punctuation insensitivity', () => {
    test('should be case insensitive', () => {
      expect(calculateSimilarity('HELLO', 'hello')).toBe(1.0);
    });

    test('should handle mixed case Portuguese', () => {
      expect(calculateSimilarity('Sejam BEM-VINDOS', 'sejam bem-vindos')).toBe(1.0);
    });

    test('should ignore punctuation and special characters', () => {
      expect(calculateSimilarity(
        'Sejam bem-vindos! Fiquem à vontade.',
        'sejam bem vindos fiquem à vontade'
      )).toBe(1.0);
    });

    test('should ignore double spaces', () => {
      expect(calculateSimilarity('hello  world', 'hello world')).toBe(1.0);
    });
  });

  // === Portuguese Specific ===
  describe('Portuguese diacritics and characters', () => {
    test('should match identical strings with ç', () => {
      expect(calculateSimilarity('açúcar', 'açúcar')).toBe(1.0);
    });

    test('should match identical strings with ã/õ', () => {
      expect(calculateSimilarity('não são', 'não são')).toBe(1.0);
    });

    test('missing accent should reduce but not zero similarity', () => {
      const score = calculateSimilarity('à vontade', 'a vontade');
      expect(score).toBeGreaterThan(0.85);
      expect(score).toBeLessThan(1.0);
    });

    test('ç vs c should have high similarity', () => {
      const score = calculateSimilarity('caroço', 'caroco');
      expect(score).toBeGreaterThan(0.8);
    });
  });

  // === Threshold Testing ===
  describe('success threshold (>= 0.85)', () => {
    test('close pronunciation should pass (>= 0.85)', () => {
      // Simulating a user who says "Sejam bemvindos" instead of "Sejam bem-vindos"
      const score = calculateSimilarity('Sejam bemvindos', 'Sejam bem-vindos');
      expect(score).toBeGreaterThanOrEqual(0.85);
    });

    test('moderately wrong pronunciation should fail (< 0.85)', () => {
      // User says something very different
      const score = calculateSimilarity('Buenos días señor', 'Sejam bem-vindos');
      expect(score).toBeLessThan(0.85);
    });

    test('completely wrong input should score very low', () => {
      const score = calculateSimilarity('abc', 'Sejam bem-vindos! Fiquem à vontade.');
      expect(score).toBeLessThan(0.2);
    });
  });

  // === Edge Cases ===
  describe('edge cases', () => {
    test('one empty string should return 0', () => {
      expect(calculateSimilarity('hello', '')).toBe(0);
    });

    test('single character match', () => {
      expect(calculateSimilarity('a', 'a')).toBe(1.0);
    });

    test('single character mismatch', () => {
      expect(calculateSimilarity('a', 'b')).toBe(0);
    });

    test('long similar phrases should have high similarity', () => {
      const phrase = 'O Lomo Vetado é o nosso Contrafilé, muito suculento.';
      const slight = 'O Lomo Vetado e o nosso Contrafile, muito suculento.';
      expect(calculateSimilarity(phrase, slight)).toBeGreaterThan(0.9);
    });

    test('swapped words should reduce similarity', () => {
      const score = calculateSimilarity('bem-vindos sejam', 'sejam bem-vindos');
      // Levenshtein is char-based, so word swaps result in significant edit distance
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1.0);
    });
  });

  // === Return Value Bounds ===
  describe('return value constraints', () => {
    test('should always return value between 0 and 1', () => {
      const testCases = [
        ['abc', 'xyz'],
        ['', 'test'],
        ['test', ''],
        ['aaaa', 'aaaa'],
        ['a', 'abcdefghijklmnop'],
      ];
      for (const [a, b] of testCases) {
        const score = calculateSimilarity(a, b);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    });
  });
});
