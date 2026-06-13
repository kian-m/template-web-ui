import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

jest.mock('firebase/auth');

const mockSignIn = jest.fn();

jest.mock('@/client', () => ({
  login: jest.fn(),
}));

import { login } from '@/client';

jest.mock('@/app/context/unified-auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    loading: false,
    error: null,
    signInWithGoogle: async () => {
      mockSignIn();
      await login({
        headers: { Authorization: 'Bearer token' },
      });
    },
    user: null,
    signOut: jest.fn(),
  }),
}));

import { auth } from '@/app/lib/firebase';

(auth as any).currentUser = { getIdToken: jest.fn().mockResolvedValue('token') };

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

import { AuthProvider } from '@/app/context/unified-auth-context';

test('login flow calls backend login', async () => {
  const { getByText } = render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
  fireEvent.click(getByText(/Login/));
  await waitFor(() => expect(mockSignIn).toHaveBeenCalled());
  await waitFor(() =>
    expect(login).toHaveBeenCalledWith({
      headers: { Authorization: 'Bearer token' },
    }),
  );
});
