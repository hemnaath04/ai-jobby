// Pure staleness check for SPA navigation. An analysis is stale (its result must
// be discarded) if a newer analysis was started, the selected job key changed
// out from under it, or the host is no longer in the DOM. Extracted as a pure
// function so it can be unit-tested without chrome/DOM.
export function isStale(
  token: number,
  jobId: string,
  currentToken: number,
  currentKey: string | null,
  connected = true,
): boolean {
  if (token !== currentToken) return true;
  if (currentKey !== jobId) return true;
  if (!connected) return true;
  return false;
}
