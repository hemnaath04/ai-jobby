import { describe, it, expect } from 'vitest';
import { isStale } from './stale';

describe('isStale (SPA stale-request guard)', () => {
  it('is not stale when token, key, and connection all match', () => {
    expect(isStale(5, 'job-1', 5, 'job-1', true)).toBe(false);
  });

  it('is stale when a newer analysis bumped the token', () => {
    expect(isStale(5, 'job-1', 6, 'job-1', true)).toBe(true);
  });

  it('is stale when the selected job key changed', () => {
    expect(isStale(5, 'job-1', 5, 'job-2', true)).toBe(true);
  });

  it('is stale when the host is no longer connected', () => {
    expect(isStale(5, 'job-1', 5, 'job-1', false)).toBe(true);
  });

  it('simulates two analyses: the first resolves after the key changed → stale', () => {
    // Analysis A starts at token 1 for job-1.
    const aToken = 1;
    const aJob = 'job-1';
    // SPA navigates to job-2: token is bumped, current key changes.
    let currentToken = 1;
    let currentKey = 'job-1';
    currentToken = 2; // ++analysisToken on key change
    currentKey = 'job-2';
    // Analysis B starts at token 2 for job-2.
    const bToken = 2;
    const bJob = 'job-2';

    // A resolves now — must be discarded.
    expect(isStale(aToken, aJob, currentToken, currentKey, true)).toBe(true);
    // B resolves now — must be kept.
    expect(isStale(bToken, bJob, currentToken, currentKey, true)).toBe(false);
  });
});
