import { render, fireEvent } from '@testing-library/react';
import WidgetShell from '@/app/components/dashboard/widgets/widget-shell';

const captureMock = jest.fn();
jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

test('captures scroll analytics', () => {
  const { getByTestId } = render(
    <WidgetShell title="Test" widgetId="w1" scrollContent>
      <div style={{ height: 300 }} />
    </WidgetShell>,
  );
  const content = getByTestId('widget-content');
  Object.defineProperty(content, 'scrollTop', { value: 20, writable: true });
  fireEvent.scroll(content);
  expect(captureMock).toHaveBeenCalledWith('widget_scrolled', {
    widget_id: 'w1',
    scroll_top: 20,
  });
});
