'use client';

import { useState, type FormEvent } from 'react';

export default function ClaimScoreSignInPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch('/claim-score/api/auth/request-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-sm px-6 py-24 text-center">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-slate-500">
          We&apos;ve sent a sign-in link to {email}. It expires in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm px-6 py-24 text-center">
      <h1 className="text-xl font-semibold">Sign in to Claim Score</h1>
      <p className="mt-2 text-sm text-slate-500">
        Enter the email you used at checkout — we&apos;ll send you a sign-in link, no password needed.
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="mt-6 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Send sign-in link
      </button>
    </form>
  );
}
