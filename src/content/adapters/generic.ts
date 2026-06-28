import type { JobSiteAdapter } from './types';
import { revealApply } from './reveal';
import { insertionBelowApply } from './insert';
import {
  extractJob,
  hasJobPostingJsonLd,
  isLikelyJobPage,
} from '../../lib/jd-extract';

// Universal fallback: works on any job posting on the web. Details-panel only
// (no per-card injection). Gated by isLikelyJobPage so it never fires on a
// non-posting page (a repo, an inbox, a blog post).
export const genericAdapter: JobSiteAdapter = {
  site: 'web',

  isSupportedPage() {
    // Indeed is handled by its own adapter; never let the generic heuristic
    // score the search-results context there.
    if (/(^|\.)indeed\.[a-z.]+$/.test(location.hostname)) return false;
    if (hasJobPostingJsonLd()) return true;
    return isLikelyJobPage(extractJob());
  },

  getResultsContainer() {
    return document.body;
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
    if (/(^|\.)indeed\.[a-z.]+$/.test(location.hostname)) return null;
    if (!hasJobPostingJsonLd() && !isLikelyJobPage(extractJob())) return null;
    return (document.querySelector('main') as HTMLElement) || document.body;
  },

  findDetailsInsertionPoint(panel) {
    // Land the panel directly below the page's Apply button (falls back to above
    // the description / top of main, so a detected job always shows the panel).
    return insertionBelowApply(panel);
  },

  findDetailsJobId() {
    // Stable per posting within a site (covers SPA query-param routing too).
    return location.pathname + location.search;
  },

  extractDetailsSummary() {
    const j = extractJob();
    return {
      id: location.pathname + location.search,
      title: j.title,
      company: j.company,
      url: location.href,
    };
  },

  extractFullJobDescription() {
    const t = extractJob().jdText;
    return t.length >= 80 ? t : null;
  },

  clickApply() {
    for (const b of Array.from(document.querySelectorAll<HTMLElement>('a, button'))) {
      const t = (b.textContent || '').trim().toLowerCase();
      if (/^apply\b/.test(t) && !t.includes('filter')) {
        revealApply(b); // passive: reveal, don't click
        return;
      }
    }
  },
};
