// Builds the validation unit (ExtractedJob) from an adapter's existing methods,
// so adapters that don't override extractJob() get it for free. The canonical
// key comes from findDetailsJobId(); title/company from extractDetailsSummary();
// description from extractFullJobDescription().
import type { ExtractedJob, JobSiteAdapter } from './types';
import { readJsonLdJob } from '../../lib/jd-extract';

const clean = (s: string | null | undefined): string =>
  (s || '').replace(/\s+/g, ' ').trim();

// Job boards/ATS whose name should never be used as the "company" fallback.
const NOT_A_COMPANY =
  /^(greenhouse|lever|workday|ashby|smartrecruiters|icims|workable|linkedin|indeed|glassdoor|ziprecruiter|monster|jobs|careers|job board|home)$/i;

/**
 * Best-effort company name when an adapter's selector misses it (common on ATS
 * boards where the company lives in the logo/title, not a labelled element).
 * Tries JSON-LD hiringOrganization, og:site_name, the document title's
 * "… at <Company>" / "<Company> - …" shape, then the ATS board's URL slug.
 */
function fallbackCompany(): string {
  const ld = readJsonLdJob() as { hiringOrganization?: { name?: string } | string } | null;
  const org = ld?.hiringOrganization;
  const ldName = typeof org === 'string' ? org : org?.name;
  if (ldName && clean(ldName).length >= 2) return clean(ldName);

  const og = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
  if (og && clean(og).length >= 2 && !NOT_A_COMPANY.test(clean(og))) return clean(og);

  const title = clean(document.title);
  const atMatch = title.match(/\bat\s+(.+?)(?:\s*[|\-–—]|$)/i);
  if (atMatch && clean(atMatch[1]).length >= 2) return clean(atMatch[1]);

  // ATS board slug, e.g. job-boards.greenhouse.io/<slug>/jobs/… or jobs.lever.co/<slug>/…
  const seg = location.pathname.split('/').filter(Boolean)[0];
  if (seg && /^[a-z0-9][a-z0-9-]{1,}$/i.test(seg) && !NOT_A_COMPANY.test(seg)) {
    return seg.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return '';
}

export function extractJobVia(adapter: JobSiteAdapter): ExtractedJob | null {
  if (adapter.extractJob) return adapter.extractJob();

  const key = adapter.findDetailsJobId();
  if (!key) return null;
  const summary = adapter.extractDetailsSummary();
  const description = adapter.extractFullJobDescription() ?? '';
  let company = clean(summary?.company);
  if (company.length < 2) company = fallbackCompany();
  return {
    key,
    title: clean(summary?.title),
    company,
    description,
    url: summary?.url ?? location.href,
  };
}

/** URL match for an adapter — prefers matches(url), falls back to isSupportedPage(). */
export function adapterMatchesUrl(adapter: JobSiteAdapter, url: URL): boolean {
  if (adapter.matches) {
    try {
      return adapter.matches(url);
    } catch {
      return false;
    }
  }
  return adapter.isSupportedPage();
}
