// SmartRecruiters (jobs.smartrecruiters.com, careers.smartrecruiters.com).
import { makeAtsAdapter } from './ats-helpers';

export const smartRecruitersAdapter = makeAtsAdapter({
  site: 'SmartRecruiters',
  matches(url) {
    return /(^|\.)smartrecruiters\.com$/.test(url.hostname);
  },
  titleSelectors: ['h1[itemprop="title"]', 'h1'],
  companySelectors: ['[itemprop="hiringOrganization"]', '.company-name'],
  descSelectors: ['[itemprop="description"]', '#st-jobContent'],
  key(url) {
    const segs = url.pathname.split('/').filter(Boolean);
    const last = segs[segs.length - 1];
    return last || url.pathname || null;
  },
});
