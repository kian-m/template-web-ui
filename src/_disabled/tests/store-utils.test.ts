import { maskApiKey } from '@/app/store/settings-store';
import { clearAppStoreCache, useAppStore } from '@/app/store/root-store';
import { cn } from '@/lib/utils';

describe('store utility functions', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({ posthogConfigured: false, remainingCredits: 0 } as any);
  });

  it('maskApiKey masks all but first 8 characters and at least 12 characters', () => {
    const masked = maskApiKey('phc_1234567890');
    expect(masked).toBe('phc_1234' + '\u2022'.repeat(12));
  });

  it('maskApiKey returns original string for short keys and empty for undefined', () => {
    expect(maskApiKey('short')).toBe('short');
    expect(maskApiKey()).toBe('');
  });

  it('clearAppStoreCache removes persisted store from localStorage', () => {
    localStorage.setItem('debark-store', 'cached');
    clearAppStoreCache();
    expect(localStorage.getItem('debark-store')).toBeNull();
  });

  it('setRemainingCredits updates the value', () => {
    useAppStore.getState().setRemainingCredits(5);
    expect(useAppStore.getState().remainingCredits).toBe(5);
  });

  it('setPosthogConfigured updates the flag', () => {
    useAppStore.getState().setPosthogConfigured(true);
    expect(useAppStore.getState().posthogConfigured).toBe(true);
  });

  it('validatePosthogConfig validates api key and project id', () => {
    const result = useAppStore.getState().validatePosthogConfig({
      apiKey: 'bad',
      projectId: 'abc',
    } as any);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid API Key format (should start with "phc_")');
    expect(result.errors).toContain('Invalid Project ID format (should be numeric)');
  });

  it('validatePosthogConfig accepts valid input', () => {
    const result = useAppStore.getState().validatePosthogConfig({
      apiKey: 'phc_123456789012345678901234567890',
      projectId: '123',
    });
    expect(result).toEqual({ isValid: true, errors: [] });
  });

  it('cn merges class names', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
