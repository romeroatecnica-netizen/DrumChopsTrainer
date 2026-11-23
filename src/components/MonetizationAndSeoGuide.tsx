import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { TranslationBundle } from '../i18n/translations';

interface AdSlotProps {
  slotId: string;
  minHeightClass: string;
  label: string;
}

/**
 * Dedicated Media.net ad slot container with reserved min-height (zero CLS)
 * and print:hidden suppression. Never overlaps interactive studio controls.
 */
export function MediaNetAdSlot({ slotId, minHeightClass, label }: AdSlotProps) {
  return (
    <aside
      id={slotId}
      aria-label={label}
      className={`ad-slot-container print:hidden w-full bg-white border border-slate-200/80 rounded-xl flex items-center justify-center px-4 py-3 ${minHeightClass}`}
    >
      {/* MEDIA.NET AD TAG INJECTION POINT (slot: {slotId}) */}
      <div className="text-center text-xs text-slate-400">
        {label}
      </div>
    </aside>
  );
}

interface MonetizationAndSeoGuideProps {
  t: TranslationBundle;
}

export function MonetizationAndSeoGuide({ t }: MonetizationAndSeoGuideProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-10">
      {/* Media.net Ad Slot 1: Between Practice Trainer and Editorial Guide */}
      <MediaNetAdSlot
        slotId="medianet-ad-slot-mid"
        minHeightClass="min-h-[100px]"
        label="Media.net Contextual Ad Placement · 728x90 / Responsive"
      />

      {/* Contextual Affiliate Drummer Gear Block */}
      <section aria-labelledby="gear-heading" className="space-y-4">
        <div>
          <h2
            id="gear-heading"
            className="text-xl font-bold text-slate-900 tracking-tight"
          >
            {t.gear.heading}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.gear.disclosure}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {t.gear.items.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="bg-white border border-slate-200 hover:border-amber-600 rounded-xl p-4 flex flex-col justify-between gap-3 transition-colors"
            >
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <span>{item.cta}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Editorial SEO Guide & Interactive FAQ */}
      <section
        id="guide"
        aria-labelledby="editorial-heading"
        className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8"
      >
        <div className="max-w-3xl space-y-2">
          <h2
            id="editorial-heading"
            className="text-2xl font-bold text-slate-900 tracking-tight"
          >
            {t.editorial.heading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.editorial.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          {t.editorial.sections.map((sec) => (
            <article key={sec.title} className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{sec.body}</p>
            </article>
          ))}
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            {t.editorial.faqHeading}
          </h3>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            {t.editorial.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-start text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Media.net Ad Slot 2: Bottom of Page */}
      <MediaNetAdSlot
        slotId="medianet-ad-slot-bottom"
        minHeightClass="min-h-[250px]"
        label="Media.net Contextual Ad Placement · Responsive Multiplex / Display"
      />
    </div>
  );
}
