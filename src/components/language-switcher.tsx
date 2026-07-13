'use client';

import { useRouter } from 'next/navigation';
import { locales } from '@/lib/i18n/config';
import { LOCALE_COOKIE_NAME } from '@/lib/i18n/get-locale';

// Manual language override. Renders nothing until a second language exists
// in src/lib/i18n/config.ts — a dropdown with one option is just clutter,
// so today this is invisible and that's expected, not a bug.
export function LanguageSwitcher() {
  const router = useRouter();

  if (locales.length <= 1) return null;

  function handleChange(code: string) {
    document.cookie = `${LOCALE_COOKIE_NAME}=${code}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <select
      aria-label="Language"
      defaultValue=""
      onChange={(e) => handleChange(e.target.value)}
      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600"
    >
      <option value="" disabled>
        Language
      </option>
      {locales.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
