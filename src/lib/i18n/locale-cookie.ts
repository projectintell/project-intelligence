// Split out from get-locale.ts so client components (like
// <LanguageSwitcher />) can read the cookie name without pulling in
// next/headers — which only works in Server Components and breaks the
// production build if it ends up in a client bundle. Keep this file free
// of any server-only imports.
export const LOCALE_COOKIE_NAME = 'chronicle_locale';
