'use client';

import { useState, type FormEvent, Suspense, createElement as h } from 'react';
import { useSearchParams } from 'next/navigation';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? undefined;
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  await fetch('/claim-score/api/auth/request-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, callbackUrl }),
  });
  setSent(true);
}

if (sent) {
  return h('div', { className: 'mx-auto max-w-sm px-6 py-24 text-center' },
           h('h1', { className: 'text-xl font-semibold' }, 'Check your email'),
           h('p', { className: 'mt-2 text-sm text-slate-500' }, `We've sent a sign-in link to ${email}. It expires in 15 minutes.`)
           );
}

return h('form', { onSubmit: handleSubmit, className: 'mx-auto max-w-sm px-6 py-24 text-center' },
         h('h1', { className: 'text-xl font-semibold' }, 'Sign in to Claim Score'),
         h('p', { className: 'mt-2 text-sm text-slate-500' }, "Enter the email you used at checkout — we'll send you a sign-in link, no password needed."),
         h('input', {
           type: 'email',
           required: true,
           value: email,
           onChange: (e: { target: { value: string } }) => setEmail(e.target.value),
           placeholder: 'you@company.com',
           className: 'mt-6 w-full rounded-md border border-slate-300 px-3 py-2 text-sm',
         }),
         h('button', {
           type: 'submit',
           className: 'mt-4 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white',
         }, 'Send sign-in link')
         );
}

export default function ClaimScoreSignInPage() {
  return h(Suspense, { fallback: null }, h(SignInForm));
}
