import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names and ignores falsy values', () => {
    expect(cn('font-bold', false && 'hidden', 'p-2')).toBe('font-bold p-2');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('deduplicates tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
  it('resolves conflicting classes to the latter', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });
  it('handles conditional classes with objects', () => {
    const result = cn('p-2', { hidden: false, block: true });
    expect(result.split(' ').sort().join(' ')).toBe('block p-2');
  });
});
