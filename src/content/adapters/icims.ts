// iCIMS (*.icims.com).
import { makeAtsAdapter } from './ats-helpers';

export const icimsAdapter = makeAtsAdapter({
  site: 'iCIMS',
  matches(url) {
    return /(^|\.)icims\.com$/.test(url.hostname);
  },
  titleSelectors: ['.iCIMS_Header', 'h1.title', '[id*="Title"]'],
  descSelectors: ['.iCIMS_JobContent', '[id*="Description"]'],
  key(url) {
    const jobId = url.searchParams.get('jobId') || url.searchParams.get('iis');
    if (jobId) return jobId;
    const m = url.pathname.match(/\/jobs\/(\d+)/);
    if (m) return m[1];
    return url.pathname || null;
  },
});
