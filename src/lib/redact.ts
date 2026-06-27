// ---------------------------------------------------------------------------
// Client-side PII redaction. Runs in the background worker BEFORE the resume is
// sent anywhere, so contact details and the candidate's name never reach the
// backend or the LLM. Skills/experience/education are preserved, so match
// quality is unaffected. The full, unredacted resume stays in local storage.
// ---------------------------------------------------------------------------

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const URL = /\bhttps?:\/\/[^\s)]+/gi;
const HANDLE_URL = /\b(?:www\.|linkedin\.com\/in\/|github\.com\/|twitter\.com\/|x\.com\/)[^\s)]+/gi;
// US / international phone shapes (loose but avoids matching plain years/IDs).
const PHONE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Mask personal identifiers in resume text. Conservative on names: only treats
 * the first non-empty line as a name when it clearly looks like one (2–3
 * capitalized words, no digits), then masks those tokens everywhere.
 */
export function redactResume(text: string): string {
  let t = text;
  t = t.replace(EMAIL, '[email]');
  t = t.replace(URL, '[link]');
  t = t.replace(HANDLE_URL, '[link]');
  t = t.replace(PHONE, '[phone]');

  const firstLine = (t.split(/\r?\n/).find((l) => l.trim().length) || '').trim();
  if (firstLine.length <= 40 && /^[A-Z][a-z]+(?:\s+[A-Z][a-z'.-]+){1,2}$/.test(firstLine)) {
    for (const part of firstLine.split(/\s+/).filter((p) => p.length > 1)) {
      t = t.replace(new RegExp(`\\b${escapeRe(part)}\\b`, 'g'), '[name]');
    }
  }
  return t;
}
