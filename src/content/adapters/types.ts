import type { JobSummary } from '../../lib/types';

/**
 * A fully-extracted job posting produced by an adapter. This is the unit the
 * page-validator (validate.ts) consumes: a canonical key plus the four fields
 * that gate injection. Built from the adapter's existing extract* methods via
 * extractJobVia() so adapters get it "for free" without re-implementing.
 */
export interface ExtractedJob {
  key: string;
  title: string;
  company: string;
  description: string;
  url: string;
}

/**
 * Per-site DOM contract. No selectors live in shared code — every platform
 * implements this against its own markup.
 *
 * Dedicated adapters (site-specific selectors) set `dedicated: true`; the single
 * universal JSON-LD/heuristic adapter sets it false. validate.ts uses this to
 * tell a 'known-ats-selector' signal (a dedicated adapter extracted a complete
 * job) from a generic heuristic extraction.
 */
export interface JobSiteAdapter {
  readonly site: string;

  /** True for site-specific adapters; false for the universal generic adapter. */
  readonly dedicated: boolean;

  /** True when the current URL/page is a jobs page this adapter handles. */
  isSupportedPage(): boolean;

  /**
   * URL-level match (host/path). Equivalent to isSupportedPage() but takes the
   * URL explicitly so it's pure/testable. Defaults to isSupportedPage() when an
   * adapter doesn't override it. detectSignals() uses this for 'known-job-url'.
   */
  matches?(url: URL): boolean;

  /**
   * Build the validated extraction unit from this page. Adapters may override;
   * otherwise extractJobVia(adapter) provides it from the methods below.
   */
  extractJob?(): ExtractedJob | null;

  /** The element to scope the MutationObserver to (the results list). */
  getResultsContainer(): HTMLElement | null;

  /** All currently-rendered job cards in the list. */
  getJobCards(): HTMLElement[];

  /** Stable id for a card (survives virtualized re-use). */
  getJobId(card: HTMLElement): string | null;

  extractJobSummary(card: HTMLElement): JobSummary | null;

  /** Element to append our card UI into (we append at the bottom). */
  findCardInsertionPoint(card: HTMLElement): HTMLElement | null;

  /** The selected-job details panel container, if open. */
  findDetailsPanel(): HTMLElement | null;

  /** Element to insert the details UI *before* (lands under apply/top-card). */
  findDetailsInsertionPoint(detailsPanel: HTMLElement): HTMLElement | null;

  /** Stable id of the currently-selected job. */
  findDetailsJobId(): string | null;

  extractDetailsSummary(): JobSummary | null;

  extractFullJobDescription(): string | null;

  /** Trigger the site's native Apply button (Quick Apply). */
  clickApply?(): void;
}
