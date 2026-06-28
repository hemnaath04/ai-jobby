import { describe, it, expect } from 'vitest';
import {
  resolveMatchPatterns,
  isValidMatchPattern,
  MATCH_PATTERNS,
  FAMILIES,
} from './patterns';

const BANNED = ['<all_urls>', '*://*/*', 'https://*/*', 'http://*/*', '*://*'];

describe('worldwide families', () => {
  it('has exactly 100 platform families, each with >=1 pattern', () => {
    expect(FAMILIES.length).toBe(100);
    for (const f of FAMILIES) expect(f.patterns.length).toBeGreaterThan(0);
    expect(new Set(FAMILIES.map((f) => f.id)).size).toBe(100);
  });
});

describe('resolveMatchPatterns', () => {
  it('returns the 160 valid worldwide patterns, 0 removed, 0 duplicates', () => {
    const r = resolveMatchPatterns();
    expect(r.patterns.length).toBe(160);
    expect(r.removed.length).toBe(0);
    expect(r.duplicates.length).toBe(0);
  });

  it('every pattern is valid and not banned', () => {
    for (const p of MATCH_PATTERNS) {
      expect(isValidMatchPattern(p)).toBe(true);
      expect(BANNED).not.toContain(p);
    }
  });

  it('rejects banned/broad patterns', () => {
    for (const p of BANNED) expect(isValidMatchPattern(p)).toBe(false);
    expect(isValidMatchPattern('*://*/jobs')).toBe(false); // bare * host
    expect(isValidMatchPattern('ftp://example.com/x')).toBe(false); // bad scheme
    expect(isValidMatchPattern('https://example.com')).toBe(false); // no path
  });

  it('has no exact duplicates', () => {
    const seen = new Set<string>();
    for (const p of MATCH_PATTERNS) {
      expect(seen.has(p)).toBe(false);
      seen.add(p);
    }
    expect(seen.size).toBe(MATCH_PATTERNS.length);
  });
});
