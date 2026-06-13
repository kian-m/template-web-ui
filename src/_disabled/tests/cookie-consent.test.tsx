import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CookieConsent from '@/components/cookie-consent';

beforeEach(() => {
  localStorage.clear();
});

test('shows banner when consent not yet given', () => {
  const { getByText } = render(<CookieConsent />);
  expect(getByText(/We use cookies to enhance your experience/)).toBeInTheDocument();
  expect(getByText('Accept')).toBeInTheDocument();
});

test('accept button stores consent and hides banner', () => {
  const { getByText, queryByText } = render(<CookieConsent />);
  fireEvent.click(getByText('Accept'));
  expect(localStorage.getItem('cookie-consent')).toBe('true');
  expect(queryByText('Accept')).toBeNull();
});
