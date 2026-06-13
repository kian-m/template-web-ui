import { errorEventName } from '@/lib/posthog-event';

describe('errorEventName', () => {
  it('appends suffix when missing', () => {
    expect(errorEventName('test')).toBe('test_error');
  });

  it('leaves existing suffix intact', () => {
    expect(errorEventName('test_error')).toBe('test_error');
  });
});
