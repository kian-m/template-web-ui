'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <div style={{ position: 'absolute', right: 16, top: 16 }}>
      {loading && <span style={{ color: 'white', opacity: 0.8 }}>…</span>}
      {!loading && !session && (
        <button
          onClick={() => signIn('google')}
          style={{
            background: '#fff',
            color: '#000',
            borderRadius: 6,
            padding: '6px 10px',
          }}
        >
          Sign in with Google
        </button>
      )}
      {!loading && session && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {session.user?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt="avatar"
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
            />
          )}
          <span style={{ color: 'white', opacity: 0.9 }}>
            {session.user?.name || session.user?.email}
          </span>
          <button
            onClick={() => signOut()}
            style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 6,
              padding: '4px 10px',
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

