'use client';

import { SessionProvider } from 'next-auth/react';

// Thin client wrapper so the root layout (a server component) can still
// provide session context to anything using next-auth/react's hooks
// (signIn(), useSession()) further down the tree — needed for the
// Claims Intelligence sign-in button, and any future "signed in as..."
// UI in the dashboard header.
export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
