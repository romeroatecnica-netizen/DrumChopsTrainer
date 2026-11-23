export const CANONICAL_ORIGIN = 'https://drumchopcue.bastelar.com';

export const SUPPORTED_LANGS = [
  'en',
  'es',
  'fr',
  'de',
  'pt',
  'ar',
  'hi',
  'ru',
  'zh',
  'ja',
] as const;

export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: SupportedLang = 'en';

export const LANG_META: Record<
  SupportedLang,
  { label: string; nativeName: string; dir: 'ltr' | 'rtl' }
> = {
  en: { label: 'English', nativeName: 'English', dir: 'ltr' },
  es: { label: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  fr: { label: 'French', nativeName: 'Français', dir: 'ltr' },
  de: { label: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  pt: { label: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  ar: { label: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  hi: { label: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  ru: { label: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  zh: { label: 'Chinese', nativeName: '中文', dir: 'ltr' },
  ja: { label: 'Japanese', nativeName: '日本語', dir: 'ltr' },
};

export function getCanonicalUrlForLang(lang: SupportedLang): string {
  return lang === DEFAULT_LANG
    ? `${CANONICAL_ORIGIN}/`
    : `${CANONICAL_ORIGIN}/?lang=${lang}`;
}
