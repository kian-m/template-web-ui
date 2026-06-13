import { act, fireEvent, render, screen } from '@testing-library/react';
import ChatInterface from '@/app/components/dashboard/chat-interface';
import { useAppStore } from '@/app/store/root-store';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props: any) => <div>{props.children}</div>,
}));

jest.mock('@/app/services/api', () => ({
  apiService: {
    sendChatMessage: jest.fn().mockResolvedValue({
      reply: 'ok',
      action: {
        type: 'add_widgets',
        widgets: [
          {
            type: 'number-card',
            title: 'New',
            size: 'small',
            data: { value: 1 },
            query: 'SELECT 1',
          },
        ],
      },
    }),
  },
}));

beforeEach(() => {
  const current = useAppStore.getState();
  useAppStore.setState({
    ...current,
    dashboards: [{ id: 'main', name: 'Main', position: 0, widgets: [] }],
    activeDashboardId: 'main',
    isNavigating: false,
    remainingCredits: 10,
  });
});

test('adds widget even when many exist', async () => {
  const store = useAppStore.getState();
  for (let i = 0; i < 6; i++) {
    store.addWidget('main', {
      type: 'number-card',
      title: 'w' + i,
      size: 'small',
      data: {},
      query: '',
    });
  }
  render(<ChatInterface />);
  const expandButton = screen.getByText('+ AI Chat');
  fireEvent.click(expandButton);
  const input = screen.getByPlaceholderText('Ask me to create or modify widgets...');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'add widget' } });
    fireEvent.submit(input.closest('form')!);
  });
  const state = useAppStore.getState();
  expect(state.dashboards.length).toBe(1);
  expect(state.dashboards[0].widgets.length).toBe(7);
});

test('does not add invalid widget', async () => {
  const api = require('@/app/services/api').apiService;
  api.sendChatMessage.mockResolvedValueOnce({
    reply: 'ok',
    action: {
      type: 'add_widgets',
      widgets: [{ type: 'number-card', title: '', size: 'small', data: {}, query: '' }],
    },
  });
  render(<ChatInterface />);
  const expandButton = screen.getByText('+ AI Chat');
  fireEvent.click(expandButton);
  const input = screen.getByPlaceholderText('Ask me to create or modify widgets...');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'add widget' } });
    fireEvent.submit(input.closest('form')!);
  });
  const state = useAppStore.getState();
  expect(state.dashboards[0].widgets.length).toBe(0);
});

test('does not add widget when credits are zero', async () => {
  useAppStore.setState({ ...useAppStore.getState(), remainingCredits: 0 });
  render(<ChatInterface />);
  const expandButton = screen.getByText('+ AI Chat');
  fireEvent.click(expandButton);
  const input = screen.getByPlaceholderText('Ask me to create or modify widgets...');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'add widget' } });
    fireEvent.submit(input.closest('form')!);
  });
  const state = useAppStore.getState();
  expect(state.dashboards[0].widgets.length).toBe(0);
});

test('chat height does not exceed 70vh on resize', () => {
  render(<ChatInterface />);
  const expandButton = screen.getByText('+ AI Chat');
  fireEvent.click(expandButton);

  const resizer = screen.getByTestId('chat-resizer');
  const container = document.querySelector('.chat-container') as HTMLElement;

  // Shrink to verify resizing works
  fireEvent.mouseDown(resizer, { clientY: 600 });
  fireEvent.mouseMove(document, { clientY: 700 });
  fireEvent.mouseUp(document);
  expect(parseFloat(container.style.height)).toBeLessThan(70);

  // Attempt to expand beyond 70vh
  fireEvent.mouseDown(resizer, { clientY: 600 });
  fireEvent.mouseMove(document, { clientY: 100 });
  fireEvent.mouseUp(document);
  expect(container.style.height).toBe('70vh');
});
