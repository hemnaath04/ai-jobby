// Workable (apply.workable.com, jobs.workable.com).
import { makeAtsAdapter } from './ats-helpers';

export const workableAdapter = makeAtsAdapter({
  site: 'Workable',
  matches(url) {
    return /(^|\.)workable\.com$/.test(url.hostname);
  },
  titleSelectors: ['[data-ui="job-title"]', 'h1'],
  companySelectors: ['[data-ui="company-name"]'],
  descSelectors: ['[data-ui="job-description"]', 'section'],
  key(url) {
    // /<company>/j/<id>
    const m = url.pathname.match(/\/j\/([A-Za-z0-9]+)/);
    if (m) return m[1];
    const segs = url.pathname.split('/').filter(Boolean);
    const last = segs[segs.length - 1];
    return last || url.pathname || null;
  },
});
