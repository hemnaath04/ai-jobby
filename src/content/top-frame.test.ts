import { describe, it, expect } from 'vitest';
import { shouldAutoRun } from './index';

describe('shouldAutoRun (top-frame guard)', () => {
  it('returns true when window.top === window.self (top frame)', () => {
    const w = {} as Window;
    (w as unknown as { top: unknown; self: unknown }).top = w;
    (w as unknown as { top: unknown; self: unknown }).self = w;
    expect(shouldAutoRun(w)).toBe(true);
  });

  it('returns false when window.top !== window.self (iframe)', () => {
    const self = {} as Window;
    const top = {} as Window;
    (self as unknown as { top: unknown; self: unknown }).top = top;
    (self as unknown as { top: unknown; self: unknown }).self = self;
    expect(shouldAutoRun(self)).toBe(false);
  });
});
