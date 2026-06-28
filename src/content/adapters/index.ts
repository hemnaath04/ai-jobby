import type { JobSiteAdapter } from './types';
import { linkedInAdapter } from './linkedin';
import { indeedAdapter } from './indeed';
import { glassdoorAdapter } from './glassdoor';
import { greenhouseAdapter } from './greenhouse';
import { leverAdapter } from './lever';
import { ashbyAdapter } from './ashby';
import { workdayAdapter } from './workday';
import { smartRecruitersAdapter } from './smartrecruiters';
import { icimsAdapter } from './icims';
import { workableAdapter } from './workable';
import { symplicityAdapter } from './symplicity';
import { genericAdapter } from './generic';

// Dedicated, site-specific adapters first (richer extraction + dedicated:true so
// validation can grant the 'known-ats-selector' signal), then the universal
// generic JSON-LD/heuristic adapter that handles every other job posting.
export const ADAPTERS: JobSiteAdapter[] = [
  linkedInAdapter,
  indeedAdapter,
  glassdoorAdapter,
  greenhouseAdapter,
  leverAdapter,
  ashbyAdapter,
  workdayAdapter,
  smartRecruitersAdapter,
  icimsAdapter,
  workableAdapter,
  symplicityAdapter,
  genericAdapter,
];

export function activeAdapter(): JobSiteAdapter | null {
  return ADAPTERS.find((a) => a.isSupportedPage()) ?? null;
}
