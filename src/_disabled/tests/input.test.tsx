import React from 'react';
import { render } from '@testing-library/react';
import { Input } from '@/components/ui/input';

test('input forwards additional props', () => {
  const { getByRole } = render(<Input placeholder="email" aria-label="email" />);
  const input = getByRole('textbox');
  expect(input).toHaveAttribute('data-slot', 'input');
  expect(input).toHaveAttribute('placeholder', 'email');
});
