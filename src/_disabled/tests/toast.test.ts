import { toast } from '@/lib/toast';
import { toast as sonnerToast } from 'sonner';
import posthog from 'posthog-js';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    loading: jest.fn(),
    promise: jest.fn(),
    dismiss: jest.fn(),
  },
}));

jest.mock('posthog-js', () => ({
  __esModule: true,
  default: { capture: jest.fn() },
}));

describe('toast utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls success with default duration', () => {
    toast.success('hello');
    expect(sonnerToast.success).toHaveBeenCalledWith('hello', {
      duration: 4000,
      description: undefined,
    });
  });

  it('reports errors to posthog and shows toast', () => {
    toast.error('fail', { description: 'bad' });
    expect(posthog.capture).toHaveBeenCalledWith('toast_error', {
      message: 'fail',
      description: 'bad',
    });
    expect(sonnerToast.error).toHaveBeenCalledWith('fail', {
      duration: 6000,
      description: 'bad',
    });
  });

  it('allows custom event names for errors', () => {
    toast.error('oops', { event: 'custom_event' });
    expect(posthog.capture).toHaveBeenCalledWith('custom_event_error', {
      message: 'oops',
      description: undefined,
    });
  });

  it('does not duplicate error suffix', () => {
    toast.error('oops', { event: 'custom_event_error' });
    expect(posthog.capture).toHaveBeenCalledWith('custom_event_error', {
      message: 'oops',
      description: undefined,
    });
  });

  it('quickSuccess uses shorter duration', () => {
    toast.quickSuccess('ok');
    expect(sonnerToast.success).toHaveBeenCalledWith('ok', {
      duration: 2000,
      description: undefined,
    });
  });

  it('loading toast has infinite duration', () => {
    toast.loading('loading');
    expect(sonnerToast.loading).toHaveBeenCalledWith('loading', {
      duration: Infinity,
    });
  });
});
