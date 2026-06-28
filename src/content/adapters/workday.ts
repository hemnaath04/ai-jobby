// Workday (*.myworkdayjobs.com, *.workdayjobs.com).
import { makeAtsAdapter } from './ats-helpers';

export const workdayAdapter = makeAtsAdapter({
  site: 'Workday',
  matches(url) {
    return /(^|\.)(myworkdayjobs|workdayjobs)\.com$/.test(url.hostname);
  },
  titleSelectors: ['[data-automation-id="jobPostingHeader"]', 'h1'],
  descSelectors: ['[data-automation-id="jobPostingDescription"]'],
  key(url) {
    // The final path segment carries the job requisition id (e.g. _R-12345).
    const segs = url.pathname.split('/').filter(Boolean);
    const last = segs[segs.length - 1];
    return last || url.pathname || null;
  },
});
