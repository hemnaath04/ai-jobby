import { describe, it, expect, beforeEach } from 'vitest';
import {
  getOrCreateDetailsHost,
  detailsHost,
  removeDetailsHost,
  DETAILS_ROOT_ID,
} from './ui';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('getOrCreateDetailsHost (one panel per tab)', () => {
  it('returns the same node on a second call', () => {
    const a = getOrCreateDetailsHost();
    document.body.appendChild(a);
    const b = getOrCreateDetailsHost();
    expect(b).toBe(a);
    expect(document.querySelectorAll(`#${DETAILS_ROOT_ID}`).length).toBe(1);
  });

  it('removes extra roots, keeping exactly one', () => {
    // Simulate a duplicate-root race: two roots in the DOM.
    for (let i = 0; i < 2; i++) {
      const el = document.createElement('div');
      el.id = DETAILS_ROOT_ID;
      document.body.appendChild(el);
    }
    expect(document.querySelectorAll(`#${DETAILS_ROOT_ID}`).length).toBe(2);
    const kept = getOrCreateDetailsHost();
    expect(document.querySelectorAll(`#${DETAILS_ROOT_ID}`).length).toBe(1);
    expect(detailsHost()).toBe(kept);
  });

  it('removeDetailsHost clears all roots', () => {
    const el = getOrCreateDetailsHost();
    document.body.appendChild(el);
    removeDetailsHost();
    expect(detailsHost()).toBeNull();
  });
});
