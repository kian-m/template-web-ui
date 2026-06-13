import { useAppStore } from '@/app/store/root-store';

describe('settings store', () => {
  beforeEach(() => {
    useAppStore.setState({ dataSources: {} } as any);
  });

  test('isDataSourceConfigured returns false when no config', () => {
    expect(useAppStore.getState().isDataSourceConfigured()).toBe(false);
  });

  test('setPosthogConfig saves valid config', () => {
    const config = {
      apiKey: 'phc_123456789012345678901234567890',
      projectId: '12345',
    };
    useAppStore.getState().setPosthogConfig(config);
    const state = useAppStore.getState();
    expect(state.dataSources.posthog?.apiKey).toBe(config.apiKey);
    expect(state.isDataSourceConfigured()).toBe(true);
  });

  test('setPosthogConfig throws on invalid config', () => {
    const config = { apiKey: 'bad_key', projectId: 'abc' } as any;
    expect(() => useAppStore.getState().setPosthogConfig(config)).toThrow();
  });

  test('removePosthogConfig clears config', () => {
    const config = {
      apiKey: 'phc_123456789012345678901234567890',
      projectId: '1',
    };
    useAppStore.getState().setPosthogConfig(config);
    useAppStore.getState().removePosthogConfig();
    expect(useAppStore.getState().dataSources.posthog).toBeUndefined();
  });
});
