// Ashby (jobs.ashbyhq.com).
import { makeAtsAdapter } from './ats-helpers';

export const ashbyAdapter = makeAtsAdapter({
  site: 'Ashby',
  matches(url) {
    return /(^|\.)ashbyhq\.com$/.test(url.hostname);
  },
  titleSelectors: ['h1', '[class*="_title"]'],
  descSelectors: ['[class*="_description"]', 'main'],
  key(url) {
    // /<company>/<uuid> — last segment is the posting uuid.
    const segs = url.pathname.split('/').filter(Boolean);
    const last = segs[segs.length - 1];
    return last || url.pathname || null;
  },
});
