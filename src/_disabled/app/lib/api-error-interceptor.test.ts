import { apiErrorInterceptor } from './api-error-interceptor';
import posthog from 'posthog-js';

jest.mock('posthog-js', () => ({ capture: jest.fn() }));
jest.mock('@/lib/toast', () => ({ toast: { error: jest.fn() } }));

describe('apiErrorInterceptor', () => {
  beforeEach(() => {
    apiErrorInterceptor.reset();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('redirects to login on 401 errors', () => {
    const router = { push: jest.fn() } as any;
    apiErrorInterceptor.init(router);

    const handled = apiErrorInterceptor.handleApiError({ status: 401 });
    expect(handled).toBe(true);
    jest.runAllTimers();
    expect(router.push).toHaveBeenCalledWith('/login');
    expect(posthog.capture).toHaveBeenCalledWith('session_expired_redirect');
  });
});
