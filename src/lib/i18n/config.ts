// Central place to add new languages later. To add one:
//   1. Add its code + display label to `locales` below.
//   2. Add a matching dictionaries/<code>.json file with the same keys
//      as dictionaries/en.json (get-dictionary.ts will need one extra
//      import line — see the comment there).
// Detection (get-locale.ts) and the <LanguageSwitcher /> component both
// read this list automatically — nothing else needs to change.
export const locales = [
  { code: 'en', label: 'English' },
] as const;

export type LocaleCode = (typeof locales)[number]['code'];

export const localeCodes: LocaleCode[] = locales.map((l) => l.code);

export const defaultLocale: LocaleCode = 'en';
