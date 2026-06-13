import React from 'react';
import { render } from '@testing-library/react';
import { Badge, badgeVariants } from '@/components/ui/badge';

test('badge renders with default variant', () => {
  const { getByText } = render(<Badge>New</Badge>);
  const el = getByText('New');
  expect(el).toHaveAttribute('data-slot', 'badge');
  expect(el.className).toContain('bg-primary');
});

test('badgeVariants returns classes for secondary variant', () => {
  expect(badgeVariants({ variant: 'secondary' })).toContain('bg-secondary');
});
