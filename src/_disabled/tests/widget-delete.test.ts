import { act } from '@testing-library/react';
import { useAppStore } from '@/app/store/root-store';

beforeEach(() => {
  const current = useAppStore.getState();
  useAppStore.setState({
    ...current,
    dashboards: [
      {
        id: 'main',
        name: 'Main',
        position: 0,
        widgets: [
          {
            id: 'w1',
            type: 'number-card',
            title: 'w1',
            size: 'small',
            position: 0,
            data: {},
            query: '',
          },
          {
            id: 'w2',
            type: 'number-card',
            title: 'w2',
            size: 'small',
            position: 1,
            data: {},
            query: '',
          },
        ],
      },
    ],
    activeDashboardId: 'main',
    isNavigating: false,
  });
});

test('removeWidget deletes widget and reindexes positions', () => {
  const store = useAppStore.getState();
  act(() => {
    store.removeWidget('main', 'w1');
  });
  const widgets = useAppStore.getState().dashboards[0].widgets;
  expect(widgets.length).toBe(1);
  expect(widgets[0].id).toBe('w2');
  expect(widgets[0].position).toBe(0);
});
