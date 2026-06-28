import type { JobSiteAdapter } from './types';
import { revealApply } from './reveal';
import { insertionBelowApply } from './insert';

const clean = (s: string | null | undefined): string =>
  (s || '').replace(/\s+/g, ' ').trim();

/** textContent (not innerText) so CSS-clamped descriptions are still captured. */
const fullText = (el: Element | null): string => {
  if (!el) return '';
  const h = el as HTMLElement;
  const inner = clean(h.innerText);
  const text = clean(h.textContent);
  return text.length > inner.length ? text : inner;
};

const first = (sels: string[]): HTMLElement | null => {
  for (const s of sels) {
    const el = document.querySelector(s);
    if (el) return el as HTMLElement;
  }
  return null;
};

// The selected job's detail lives in the right pane on a search page, or fills
// the page on /viewjob. These selectors target THAT job — never the search
// heading ("<query> jobs in <city>"), which is a separate <h1>.
const TITLE_SELECTORS = [
  'h2[data-testid="jobsearch-JobInfoHeader-title"]',
  'h1[data-testid="jobsearch-JobInfoHeader-title"]',
  'h2.jobsearch-JobInfoHeader-title',
  'h1.jobsearch-JobInfoHeader-title',
  '[data-testid="simpler-jobTitle"]',
  '[data-testid="jobsearch-JobInfoHeader-title"]',
];
const COMPANY_SELECTORS = [
  '[data-testid="inlineHeader-companyName"]',
  '[data-testid="jobsearch-JobInfoHeader-companyName"]',
  '[data-company-name="true"]',
  '.jobsearch-JobInfoHeader-companyNameLink',
  '.jobsearch-CompanyInfoContainer a',
];
const DESC_SELECTORS = [
  '#jobDescriptionText',
  '[data-testid="jobsearch-JobComponent-description"]',
];
const PANE_SELECTORS = [
  '.jobsearch-RightPane',
  '[data-testid="jobsearch-ViewjobPaneWrapper"]',
  '#jobsearch-ViewjobPaneWrapper',
  '.jobsearch-JobComponent',
  '#vjs-container',
];

function jobKey(): string | null {
  const p = new URLSearchParams(location.search);
  const k = p.get('vjk') || p.get('jk');
  if (k) return k;
  // Fallback: derive a stable id from the selected job's title so the panel
  // still updates between selections even if the URL param is absent.
  const title = clean(first(TITLE_SELECTORS)?.textContent);
  return title ? `t:${title}` : null;
}

// Indeed (indeed.com and country subdomains). Split-view search + /viewjob. We
// only inject the details panel, scoped to the SELECTED job in the right pane.
export const indeedAdapter: JobSiteAdapter = {
  site: 'indeed',

  isSupportedPage() {
    if (!/(^|\.)indeed\.[a-z.]+$/.test(location.hostname)) return false;
    // A real job detail must be present (title + description), otherwise this is
    // a bare search list with nothing selected — leave it to no panel.
    return !!first(TITLE_SELECTORS) && !!first(DESC_SELECTORS);
  },

  getResultsContainer() {
    return (document.querySelector('main') as HTMLElement) || document.body;
  },

  getJobCards() {
    return [];
  },
  getJobId() {
    return null;
  },
  extractJobSummary() {
    return null;
  },
  findCardInsertionPoint() {
    return null;
  },

  findDetailsPanel() {
    // Only when a selected-job detail is actually rendered.
    if (!first(TITLE_SELECTORS) || !first(DESC_SELECTORS)) return null;
    return first(PANE_SELECTORS) || (document.querySelector('main') as HTMLElement) || document.body;
  },

  findDetailsInsertionPoint(panel) {
    // Sit just above the job description — i.e. inside the right pane, below the
    // title + apply button. Prefer this over the generic apply-climb so the panel
    // lands in the pane (not after it).
    const desc = first(DESC_SELECTORS);
    const descBlock =
      (desc?.closest('[data-testid="jobsearch-JobComponent-description"]') as HTMLElement) ||
      desc;
    if (descBlock && descBlock.parentElement) return descBlock;
    return insertionBelowApply(panel) || panel;
  },

  findDetailsJobId() {
    return jobKey();
  },

  extractDetailsSummary() {
    const id = jobKey();
    const title = clean(first(TITLE_SELECTORS)?.textContent);
    if (!id || !title) return null;
    const company = clean(first(COMPANY_SELECTORS)?.textContent);
    return { id, title, company, url: location.href };
  },

  extractFullJobDescription() {
    const t = fullText(first(DESC_SELECTORS));
    return t.length >= 80 ? t : null;
  },

  clickApply() {
    const container = document.querySelector('#applyButtonLinkContainer');
    const btn =
      (container?.querySelector('a, button') as HTMLElement) ||
      (() => {
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('a, button'))) {
          const t = clean(el.textContent).toLowerCase();
          if (t && t.length < 28 && /\bapply\b/.test(t) && !t.includes('filter')) return el;
        }
        return null;
      })();
    revealApply(btn); // passive: reveal, don't auto-click
  },
};
