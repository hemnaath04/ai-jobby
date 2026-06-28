// Lever (jobs.lever.co, jobs.eu.lever.co).
import { makeAtsAdapter, ogCompany } from './ats-helpers';

export const leverAdapter = makeAtsAdapter({
  site: 'Lever',
  matches(url) {
    return /(^|\.)lever\.co$/.test(url.hostname);
  },
  titleSelectors: ['.posting-headline h2', 'h2'],
  descSelectors: ['.posting-content', '[data-qa="job-description"]', '.section-wrapper'],
  key(url) {
    // /<company>/<uuid> — the last path segment is the canonical posting id.
    const segs = url.pathname.split('/').filter(Boolean);
    const last = segs[segs.length - 1];
    return last || url.pathname || null;
  },
  companyFallback() {
    // First path segment is the company slug on Lever.
    const seg = location.pathname.split('/').filter(Boolean)[0];
    return ogCompany() || (seg ? seg.replace(/-/g, ' ') : '');
  },
});
