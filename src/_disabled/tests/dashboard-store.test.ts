import { act } from '@testing-library/react';
import { useAppStore } from '@/app/store/root-store';

jest.useFakeTimers();

function setup() {
  const current = useAppStore.getState();
  useAppStore.setState({
    ...current,
    dashboards: [{ id: 'main', name: 'Main', position: 0, widgets: [] }],
    activeDashboardId: 'main',
    isNavigating: false,
  });
}

beforeEach(() => {
  setup();
});

test('addWidget allows adding many widgets', () => {
  const { addWidget } = useAppStore.getState();
  let success = true;
  const total = 8;
  for (let i = 0; i < total; i++) {
    act(() => {
      success = addWidget('main', {
        type: 'number-card',
        title: `w${i}`,
        size: 'small',
        data: {},
        query: '',
      });
      expect(success).toBe(true);
    });
  }

  const state = useAppStore.getState();
  expect(state.dashboards.length).toBe(1);
  expect(state.dashboards[0].widgets.length).toBe(total);
});

test('delete dashboard removes it and sets new active dashboard', () => {
  const store = useAppStore.getState();
  act(() => {
    store.addDashboard('second', 'Second');
  });
  const secondId = useAppStore.getState().dashboards[0].id;
  act(() => {
    store.deleteDashboard('main');
  });
  const state = useAppStore.getState();
  expect(state.dashboards.find((d) => d.id === 'main')).toBeUndefined();
  expect(state.activeDashboardId).toBe(secondId);
});
