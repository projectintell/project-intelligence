'use client';

import { signIn } from 'next-auth/react';

export default function DashboardSignInPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">Claims Intelligence</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in with your Microsoft account to continue.
      </p>
      <button
        onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
        className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Sign in with Microsoft
      </button>
    </div>
  );
}
