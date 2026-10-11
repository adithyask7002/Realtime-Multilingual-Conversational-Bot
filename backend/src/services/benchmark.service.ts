// ============================================
// VaaniX Benchmark Service
// WER + CER calculation
// ============================================

/**
 * Normalize text before calculating benchmark metrics.
 *
 * This makes the comparison fair by:
 * - converting Unicode to NFC
 * - converting English letters to lowercase
 * - removing common punctuation
 * - normalizing multiple spaces
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[.,!?;:"“”‘’()[\]{}،。！？；：]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calculate Levenshtein edit distance.
 *
 * Counts:
 * - substitutions
 * - insertions
 * - deletions
 */
function levenshteinDistance<T>(
  reference: T[],
  hypothesis: T[]
): number {
  const rows = reference.length + 1;
  const columns = hypothesis.length + 1;

  const matrix: number[][] = Array.from(
    { length: rows },
    () => Array(columns).fill(0)
  );

  for (let i = 0; i < rows; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j < columns; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < columns; j++) {
      const cost =
        reference[i - 1] === hypothesis[j - 1]
          ? 0
          : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[rows - 1][columns - 1];
}

/**
 * Calculate Word Error Rate.
 *
 * WER = word edit distance / number of reference words
 *
 * Returned as a decimal:
 * 0.08 = 8%
 */
export function calculateWER(
  referenceText: string,
  hypothesisText: string
): number {
  const reference = normalizeText(referenceText);
  const hypothesis = normalizeText(hypothesisText);

  const referenceWords = reference
    ? reference.split(/\s+/)
    : [];

  const hypothesisWords = hypothesis
    ? hypothesis.split(/\s+/)
    : [];

  if (referenceWords.length === 0) {
    return hypothesisWords.length === 0 ? 0 : 1;
  }

  const distance = levenshteinDistance(
    referenceWords,
    hypothesisWords
  );

  return distance / referenceWords.length;
}

/**
 * Split text into Unicode code points.
 *
 * Array.from() is preferable to text.length for
 * Indian scripts because many characters are represented
 * by multiple UTF-16 code units.
 */
function toCharacters(text: string): string[] {
  return Array.from(
    normalizeText(text).replace(/\s/g, "")
  );
}

/**
 * Calculate Character Error Rate.
 *
 * CER = character edit distance / reference characters
 *
 * Returned as a decimal:
 * 0.05 = 5%
 */
export function calculateCER(
  referenceText: string,
  hypothesisText: string
): number {
  const referenceCharacters =
    toCharacters(referenceText);

  const hypothesisCharacters =
    toCharacters(hypothesisText);

  if (referenceCharacters.length === 0) {
    return hypothesisCharacters.length === 0 ? 0 : 1;
  }

  const distance = levenshteinDistance(
    referenceCharacters,
    hypothesisCharacters
  );

  return distance / referenceCharacters.length;
}

/**
 * Calculate both WER and CER.
 */
export function calculateBenchmarkMetrics(
  referenceText: string,
  hypothesisText: string
) {
  return {
    wer: calculateWER(
      referenceText,
      hypothesisText
    ),

    cer: calculateCER(
      referenceText,
      hypothesisText
    ),
  };
}