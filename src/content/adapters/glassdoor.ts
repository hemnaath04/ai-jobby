// Glassdoor (glassdoor.com and country TLDs).
import { makeAtsAdapter } from './ats-helpers';

export const glassdoorAdapter = makeAtsAdapter({
  site: 'Glassdoor',
  matches(url) {
    return /(^|\.)glassdoor\.[a-z.]+$/.test(url.hostname);
  },
  titleSelectors: ['[data-test="job-title"]', '[class*="JobDetails_jobTitle"]', 'h1'],
  companySelectors: ['[data-test="employer-name"]', '[class*="EmployerProfile"]'],
  descSelectors: ['#JobDescriptionContainer', '[class*="JobDetails_jobDescription"]'],
  key(url) {
    const jl =
      url.searchParams.get('jobListingId') || url.searchParams.get('jl');
    if (jl) return jl;
    const m = url.pathname.match(/_IL[^_]*_KO[^_]*\.htm/) || url.pathname.match(/jobListingId=(\d+)/);
    if (m) return m[0];
    return url.pathname + url.search || null;
  },
});
