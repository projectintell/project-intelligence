import { cookies, headers } from 'next/headers';
import { defaultLocale, localeCodes, type LocaleCode } from './config';
import { LOCALE_COOKIE_NAME } from './locale-cookie';

// Re-exported so existing imports of LOCALE_COOKIE_NAME from this file
// keep working — the actual value lives in locale-cookie.ts, which has no
// next/headers import, so <LanguageSwitcher /> (a Client Component) can
// import the name directly from there instead of from here.
export { LOCALE_COOKIE_NAME };

// Resolves which language to render the current request in.
//
// Order of precedence:
//   1. Manual override cookie — set by <LanguageSwitcher />, always wins.
//   2. Visitor's browser Accept-Language header — this is what "auto
//      detect and show their language" actually means in practice; a
//      browser set to German will request `de` regardless of where the
//      request geographically originates.
//   3. defaultLocale fallback.
//
// Note on geo/IP: Vercel also exposes the visitor's country for free via
// the `x-vercel-ip-country` request header, if we ever want to bias
// language selection by location instead of (or alongside) browser
// language — e.g. defaulting anyone geolocated to Germany to German even
// if their browser happens to be set to English. Not wired in here since
// browser language is the more reliable signal for "what language does
// this person actually read," but the header is there when it's needed.
export function getLocale(): LocaleCode {
  const override = cookies().get(LOCALE_COOKIE_NAME)?.value;
  if (override && localeCodes.includes(override as LocaleCode)) {
    return override as LocaleCode;
  }

  const acceptLanguage = headers().get('accept-language') ?? '';
  const requested = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim().split('-')[0]?.toLowerCase())
    .filter(Boolean);

  const match = requested.find((code) => localeCodes.includes(code as LocaleCode));
  return (match as LocaleCode) ?? defaultLocale;
}
