import 'server-only';
import type { LocaleCode } from './config';
import { defaultLocale } from './config';

// One entry per supported locale. When adding a language, add its import
// here alongside the new dictionaries/<code>.json file — everything else
// (detection, the switcher, pages calling getDictionary()) picks it up
// without further changes.
const loaders: Record<LocaleCode, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((m) => m.default as Dictionary),
};

// Shape is derived from en.json — the source of truth for which keys
// every other language's dictionary file must also provide.
export type Dictionary = typeof import('./dictionaries/en.json');

export async function getDictionary(locale: LocaleCode): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders[defaultLocale];
  return load();
}
