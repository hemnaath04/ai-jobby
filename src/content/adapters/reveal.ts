// Scroll the site's native Apply control into view and briefly highlight it.
// The user clicks the real button themselves — we never programmatically click
// or otherwise interact with the job site. This keeps the extension PURELY
// PASSIVE: it only reads the posting the user is viewing, generating no
// site-side activity (no clicks, no requests, no automation), which is what
// keeps it clear of job-site anti-automation / ToS triggers.
export function revealApply(el: HTMLElement | null): void {
  if (!el) return;
  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const prevOutline = el.style.outline;
    const prevOffset = el.style.outlineOffset;
    el.style.outline = '3px solid #CCFF00';
    el.style.outlineOffset = '2px';
    setTimeout(() => {
      el.style.outline = prevOutline;
      el.style.outlineOffset = prevOffset;
    }, 2200);
  } catch {
    /* never throw into the host page */
  }
}
