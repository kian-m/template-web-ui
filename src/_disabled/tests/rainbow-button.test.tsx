import React from 'react';
import { render } from '@testing-library/react';
import { RainbowButton } from '@/components/magicui/rainbow-button';

it('renders with default variant classes', () => {
  const { getByRole } = render(<RainbowButton>Click me</RainbowButton>);
  const button = getByRole('button');
  expect(button.className).toContain('animate-rainbow');
});

it('supports outline variant', () => {
  const { getByRole } = render(<RainbowButton variant="outline">Outline</RainbowButton>);
  expect(getByRole('button').className).toContain('border');
});

it('uses child element when asChild is set', () => {
  const { getByText } = render(
    <RainbowButton asChild>
      <a href="/test">Link</a>
    </RainbowButton>,
  );
  const link = getByText('Link');
  expect(link.tagName).toBe('A');
  expect(link.className).toContain('animate-rainbow');
});
