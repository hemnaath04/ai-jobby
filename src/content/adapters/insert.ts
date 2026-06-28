// Shared insertion logic so every site places the panel in the same spot:
// directly BELOW the page's Apply button. The injector inserts the host *before*
// the element returned here, so we return the node that follows the apply block.
// Critically, this always returns a usable anchor when a panel/scope exists, so
// a detected job ALWAYS shows the panel somewhere sensible (never silently
// fails because one selector didn't match).
import { getJdAnchor } from '../../lib/jd-extract';

const clean = (s: string | null | undefined): string =>
  (s || '').replace(/\s+/g, ' ').trim();

// Matches the real apply control across sites; excludes lookalikes.
const APPLY_RX = /\b(easy apply|quick apply|apply now|apply|submit application)\b/;
const APPLY_SKIP_RX =
  /(filter|applied|applicant|applies|how to apply|application status|saved)/;

function isVisible(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 6 || r.height < 6) return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== 'hidden' && cs.display !== 'none';
}

/** Robustly find the page's primary Apply control (link, button, or submit). */
export function findApplyButton(): HTMLElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(
      'a, button, [role="button"], input[type="submit"], input[type="button"]',
    ),
  );
  for (const el of candidates) {
    const t = clean(
      el.textContent || (el as HTMLInputElement).value || el.getAttribute('aria-label'),
    ).toLowerCase();
    if (!t || t.length > 28) continue;
    if (APPLY_SKIP_RX.test(t)) continue;
    if (!APPLY_RX.test(t)) continue;
    if (!isVisible(el)) continue;
    return el; // first visible apply control in document order
  }
  return null;
}

/** Climb from the apply control to its "top-card" block (a sizable container). */
function applyBlock(apply: HTMLElement): HTMLElement {
  let block: HTMLElement = apply;
  for (let i = 0; i < 8 && block.parentElement; i++) {
    if (block.parentElement.getBoundingClientRect().height >= 120) {
      return block.parentElement;
    }
    block = block.parentElement;
  }
  return block;
}

/**
 * Anchor to insert the panel BEFORE, so it lands right under the apply area.
 * Falls back to above-the-description, then the top of the scope — never null
 * when a usable scope exists.
 */
export function insertionBelowApply(panel: HTMLElement | null): HTMLElement | null {
  const apply = findApplyButton();
  if (apply) {
    const block = applyBlock(apply);
    const after = block.nextElementSibling as HTMLElement | null;
    if (after && after.parentElement) return after;
  }
  // Fallback 1: just above the job description.
  const jd = getJdAnchor();
  if (jd && jd.parentElement) return jd;
  // Fallback 2: top of the panel/main so it's always visible.
  const scope =
    panel || (document.querySelector('main') as HTMLElement) || document.body;
  const firstChild = scope.firstElementChild as HTMLElement | null;
  if (firstChild && firstChild.parentElement) return firstChild;
  return scope.parentElement ? scope : null;
}
