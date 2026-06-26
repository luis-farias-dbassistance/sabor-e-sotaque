// Levenshtein distance for pronunciation comparison

/**
 * Normalizes text for speech recognition comparison.
 * Strips common punctuation, symbols, accents if needed (though we keep primary diacritics for pronunciation value),
 * and formats spacing.
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    // Remove punctuation: ! ? . , ; : ( ) [ ] { } " ' - _ / \ etc.
    // Replace hyphens with space to prevent glued words (e.g., bem-vindos -> bem vindos)
    .replace(/-/g, " ")
    .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?"'¡¿]/g, "")
    // Replace multiple spaces with a single space and trim
    .replace(/\s+/g, " ")
    .trim();
};

export const calculateSimilarity = (s1: string, s2: string): number => {
  const norm1 = normalizeText(s1);
  const norm2 = normalizeText(s2);

  const longer = norm1.length > norm2.length ? norm1 : norm2;
  const shorter = norm1.length > norm2.length ? norm2 : norm1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = (str1: string, str2: string): number => {
    const costs: number[] = [];
    for (let i = 0; i <= str1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= str2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (str1.charAt(i - 1) !== str2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[str2.length] = lastValue;
    }
    return costs[str2.length];
  };

  const distance = editDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};
