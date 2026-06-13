import { render } from '@testing-library/react';
import SidebarBrand from '@/app/components/dashboard/sidebar-brand';

it('renders the brand title', () => {
  const { getByText } = render(<SidebarBrand />);
  expect(getByText('Debark')).toBeInTheDocument();
});
