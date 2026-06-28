// ---------------------------------------------------------------------------
// Single source of truth for which sites RoleReveal auto-runs on. The curated
// worldwide set (100 platform families → narrow host patterns) lives in
// worldwide-launch-sites.json; this module validates + dedupes them and is
// consumed by BOTH the build (manifest.config.ts generates content_scripts.matches
// from here) and the runtime (page validation). Any site NOT in this set works
// through the manual toolbar action (activeTab + scripting). There is no second
// copy of the patterns anywhere.
// ---------------------------------------------------------------------------
import worldwide from './worldwide-launch-sites.json';

/** How well a platform is supported (Phase 3). */
export type SupportLevel =
  | 'verified-automatic'
  | 'automatic-beta'
  | 'manual-generic'
  | 'unsupported';

export interface PlatformFamily {
  id: string;
  region: string;
  supportLevel: SupportLevel;
  patterns: string[];
}

export interface PageValidationConfig {
  requireTopFrame: boolean;
  requireCanonicalJobKey: boolean;
  minimumTitleLength: number;
  minimumCompanyLength: number;
  minimumDescriptionLength: number;
  acceptedSignals: string[];
  rejectPageTypes: string[];
}

export const FAMILIES: PlatformFamily[] = worldwide.families as PlatformFamily[];
export const PAGE_VALIDATION: PageValidationConfig = worldwide.pageValidation;
export const MANUAL_FALLBACK = worldwide.manualFallback;

// Broad patterns we refuse to emit even if present in the config — they would
// defeat the whole point (and slow Web Store review).
const BANNED = new Set(['<all_urls>', '*://*/*', 'https://*/*', 'http://*/*', '*://*']);

/**
 * Validate a Chrome MV3 match pattern: <scheme>://<host><path>.
 * scheme: * | http | https. host: optional leading "*.", DNS labels, or bare "*"
 * (which we reject as too broad). path must start with "/".
 */
export function isValidMatchPattern(p: string): boolean {
  if (BANNED.has(p)) return false;
  const m = /^(\*|https?):\/\/([^/]+)(\/.*)$/.exec(p);
  if (!m) return false;
  const host = m[2];
  if (host === '*') return false; // too broad
  if (!/^(\*\.)?([a-z0-9-]+\.)*[a-z0-9-]+$/i.test(host)) return false;
  return m[3].startsWith('/');
}

export interface PatternResult {
  patterns: string[];
  removed: string[];
  duplicates: string[];
}

/** Validate + dedupe the configured worldwide auto-run patterns. */
export function resolveMatchPatterns(): PatternResult {
  const raw: string[] = FAMILIES.flatMap((f) => f.patterns);
  const seen = new Set<string>();
  const patterns: string[] = [];
  const removed: string[] = [];
  const duplicates: string[] = [];
  for (const p of raw) {
    if (!isValidMatchPattern(p)) {
      removed.push(p);
      continue;
    }
    if (seen.has(p)) {
      duplicates.push(p);
      continue;
    }
    seen.add(p);
    patterns.push(p);
  }
  return { patterns, removed, duplicates };
}

/** The validated match-pattern list used for content_scripts.matches. */
export const MATCH_PATTERNS: string[] = resolveMatchPatterns().patterns;
