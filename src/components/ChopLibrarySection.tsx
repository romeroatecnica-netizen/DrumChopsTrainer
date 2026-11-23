import { useMemo, useState } from 'react';
import { CheckCircle2, Plus, Search, Trash2 } from 'lucide-react';
import type { ChopPattern, DifficultyLevel, DrumProfile } from '../types/drum';
import type { TranslationBundle } from '../i18n/translations';

interface ChopLibrarySectionProps {
  libraryChops: ChopPattern[];
  activeProfile: DrumProfile;
  selectedChopId: string;
  onSelectChop: (chop: ChopPattern) => void;
  onCreateCustom: () => void;
  onDeleteCustom: (chopId: string) => void;
  t: TranslationBundle;
}

type LevelFilter = 'all' | 'custom' | DifficultyLevel;

export function ChopLibrarySection({
  libraryChops,
  activeProfile,
  selectedChopId,
  onSelectChop,
  onCreateCustom,
  onDeleteCustom,
  t,
}: ChopLibrarySectionProps) {
  const [filter, setFilter] = useState<LevelFilter>('all');
  const [query, setQuery] = useState('');

  const allChops = useMemo(
    () => [...activeProfile.customChops, ...libraryChops],
    [activeProfile.customChops, libraryChops]
  );

  const filteredChops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allChops.filter((chop) => {
      if (filter === 'custom' && !chop.isCustom) return false;
      if (typeof filter === 'number' && chop.level !== filter) return false;
      if (!q) return true;
      const stickingText = chop.steps.map((s) => s.hand).join(' ').toLowerCase();
      const voiceText = chop.steps.map((s) => s.voice).join(' ').toLowerCase();
      return (
        chop.title.toLowerCase().includes(q) ||
        chop.categoryTag.toLowerCase().includes(q) ||
        stickingText.includes(q) ||
        voiceText.includes(q)
      );
    });
  }, [allChops, filter, query]);

  const activeLevelInfo = useMemo(() => {
    if (filter === 1) return { title: t.levels.l1Title, desc: t.levels.l1Desc };
    if (filter === 2) return { title: t.levels.l2Title, desc: t.levels.l2Desc };
    if (filter === 3) return { title: t.levels.l3Title, desc: t.levels.l3Desc };
    if (filter === 4) return { title: t.levels.l4Title, desc: t.levels.l4Desc };
    if (filter === 5) return { title: t.levels.l5Title, desc: t.levels.l5Desc };
    if (filter === 6) return { title: t.levels.l6Title, desc: t.levels.l6Desc };
    return null;
  }, [filter, t]);

  return (
    <section id="library" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.library.heading}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">{t.library.subheading}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.library.searchPlaceholder}
              className="ps-9 pe-3 py-2 text-xs bg-white border border-slate-200 rounded-lg w-56 focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            type="button"
            onClick={onCreateCustom}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.controls.createCustom}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        {(
          [
            { key: 'all', label: t.levels.all },
            { key: 1, label: 'L1' },
            { key: 2, label: 'L2' },
            { key: 3, label: 'L3' },
            { key: 4, label: 'L4' },
            { key: 5, label: 'L5' },
            { key: 6, label: 'L6' },
            {
              key: 'custom',
              label: `${t.levels.custom} (${activeProfile.customChops.length})`,
            },
          ] as Array<{ key: LevelFilter; label: string }>
        ).map((tab) => (
          <button
            key={String(tab.key)}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filter === tab.key
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeLevelInfo && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">
            {activeLevelInfo.title}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">{activeLevelInfo.desc}</p>
        </div>
      )}

      {/* Pattern Grid */}
      {filteredChops.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
          {t.library.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredChops.map((chop) => {
            const isSelected = chop.id === selectedChopId;
            const isMastered = activeProfile.masteredChopIds.includes(chop.id);
            const bestBpm = activeProfile.bestBpmByChop[chop.id];
            const stickingPreview = chop.steps
              .slice(0, 12)
              .map((s) => s.hand)
              .join(' ');

            return (
              <div
                key={chop.id}
                onClick={() => onSelectChop(chop)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectChop(chop);
                  }
                }}
                className={`text-start bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-amber-600 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5">
                  {/* Unboxed Metadata Line */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="truncate">
                      <strong className="text-amber-700 font-semibold">
                        L{chop.level}
                      </strong>{' '}
                      · <span className="font-mono-tabular">{chop.timeSignature}</span>{' '}
                      · {t.subdivisions[chop.subdivision]}
                    </span>
                    {isMastered && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.controls.mastered}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {chop.title}
                  </h3>

                  <p className="font-mono-tabular text-xs text-slate-600 truncate">
                    {stickingPreview}
                    {chop.steps.length > 12 ? ' …' : ''}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500 font-mono-tabular">
                  <span>
                    {chop.defaultBpm} → {chop.targetBpm} BPM
                  </span>

                  <div className="flex items-center gap-2">
                    {bestBpm ? (
                      <span className="text-emerald-700 font-semibold">
                        {t.controls.bestBpm}: {bestBpm}
                      </span>
                    ) : null}

                    {chop.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCustom(chop.id);
                        }}
                        aria-label={t.library.deleteCustom}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
