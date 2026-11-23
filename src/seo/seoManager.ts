import {
  CANONICAL_ORIGIN,
  DEFAULT_LANG,
  getCanonicalUrlForLang,
  LANG_META,
  SUPPORTED_LANGS,
  type SupportedLang,
} from '../config/site';
import type { TranslationBundle } from '../i18n/translations';

const LANG_PREF_KEY = 'chopcue_lang_pref';

export function detectInitialLanguage(): SupportedLang {
  try {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang')?.toLowerCase();
    if (queryLang && (SUPPORTED_LANGS as readonly string[]).includes(queryLang)) {
      return queryLang as SupportedLang;
    }

    const stored = window.localStorage.getItem(LANG_PREF_KEY)?.toLowerCase();
    if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)) {
      return stored as SupportedLang;
    }

    const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
    if ((SUPPORTED_LANGS as readonly string[]).includes(browserLang)) {
      return browserLang as SupportedLang;
    }
  } catch {
    // Fallback safely to English
  }
  return DEFAULT_LANG;
}

export function persistLanguageSelection(lang: SupportedLang): void {
  try {
    window.localStorage.setItem(LANG_PREF_KEY, lang);
    const url = new URL(window.location.href);
    if (lang === DEFAULT_LANG) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  } catch {
    // Safe fallback in restricted frames
  }
}

/**
 * Synchronizes <html lang/dir>, <title>, meta descriptions, OpenGraph,
 * canonical/hreflang links (strictly bound to CANONICAL_ORIGIN), and JSON-LD.
 */
export function syncSeoHead(lang: SupportedLang, t: TranslationBundle): void {
  const meta = LANG_META[lang];
  const canonicalUrl = getCanonicalUrlForLang(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = meta.dir;
  document.title = t.seo.title;

  const setMeta = (selector: string, content: string) => {
    const el = document.querySelector<HTMLMetaElement>(selector);
    if (el) el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', t.seo.description);
  setMeta('meta[property="og:title"]', t.seo.title);
  setMeta('meta[property="og:description"]', t.seo.description);
  setMeta('meta[property="og:url"]', canonicalUrl);
  setMeta('meta[name="twitter:title"]', t.seo.title);
  setMeta('meta[name="twitter:description"]', t.seo.description);

  const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', canonicalUrl);
  }

  // Ensure alternate hreflang tags always reflect CANONICAL_ORIGIN
  SUPPORTED_LANGS.forEach((code) => {
    const alt = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${code}"]`
    );
    if (alt) {
      alt.setAttribute('href', getCanonicalUrlForLang(code));
    }
  });
  const xDefault = document.querySelector<HTMLLinkElement>(
    'link[rel="alternate"][hreflang="x-default"]'
  );
  if (xDefault) {
    xDefault.setAttribute('href', `${CANONICAL_ORIGIN}/`);
  }

  // Update dynamic JSON-LD (SoftwareApplication + FAQPage)
  const jsonLdScript = document.getElementById('drumchopcue-jsonld');
  if (jsonLdScript) {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'drumchopcue',
          url: canonicalUrl,
          inLanguage: lang,
          applicationCategory: 'MusicApplication',
          operatingSystem: 'Web',
          description: t.seo.appDescription,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'FAQPage',
          inLanguage: lang,
          mainEntity: t.editorial.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        },
      ],
    };
    jsonLdScript.textContent = JSON.stringify(schema);
  }
}
