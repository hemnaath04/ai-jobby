// Greenhouse (boards.greenhouse.io, job-boards.greenhouse.io, apply.greenhouse.io).
import { makeAtsAdapter } from './ats-helpers';

export const greenhouseAdapter = makeAtsAdapter({
  site: 'Greenhouse',
  matches(url) {
    return /(^|\.)greenhouse\.io$/.test(url.hostname);
  },
  titleSelectors: ['.app-title', '.job__title h1', 'h1'],
  companySelectors: ['.company-name', '.job__company'],
  descSelectors: ['#content', '.job__description', '[class*="description"]'],
  key(url) {
    const m = url.pathname.match(/\/jobs\/(\d+)/);
    if (m) return m[1];
    const gh = url.searchParams.get('gh_jid');
    if (gh) return gh;
    return url.pathname || null;
  },
});
