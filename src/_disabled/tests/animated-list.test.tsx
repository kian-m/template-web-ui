import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnimatedList } from '@/components/magicui/animated-list';
import { act } from 'react';

jest.useFakeTimers();

test('reveals items sequentially based on delay', () => {
  render(
    <AnimatedList delay={500}>
      <div>First</div>
      <div>Second</div>
    </AnimatedList>,
  );
  expect(screen.getByText('First')).toBeInTheDocument();
  expect(screen.queryByText('Second')).toBeNull();
  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(screen.getByText('Second')).toBeInTheDocument();
});
