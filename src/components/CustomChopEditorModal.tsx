import { useState } from 'react';
import { X } from 'lucide-react';
import type {
  ChopPattern,
  ChopStep,
  DifficultyLevel,
  DrumVoice,
  DynamicLevel,
  Hand,
  SubdivisionType,
} from '../types/drum';
import type { TranslationBundle } from '../i18n/translations';

interface CustomChopEditorModalProps {
  initialPattern: ChopPattern | null;
  onSave: (pattern: ChopPattern) => void;
  onAuditionStep: (step: ChopStep) => void;
  onClose: () => void;
  t: TranslationBundle;
}

const VOICES: DrumVoice[] = [
  'snare',
  'tom1',
  'tom2',
  'floor',
  'kick',
  'hihat',
  'crash',
  'rest',
];

const VOICE_SHORT: Record<DrumVoice, string> = {
  kick: 'KK',
  snare: 'SN',
  tom1: 'T1',
  tom2: 'T2',
  floor: 'FT',
  hihat: 'HH',
  crash: 'CR',
  rest: '--',
};

const HANDS: Hand[] = ['R', 'L', 'K', '-'];
const DYNAMICS: DynamicLevel[] = ['normal', 'accent', 'ghost', 'rest'];

function buildDefaultSteps(count: number): ChopStep[] {
  return Array.from({ length: count }, (_, i) => ({
    voice: i === count - 1 ? 'crash' : i % 4 === 0 ? 'tom1' : 'snare',
    hand: i % 2 === 0 ? 'R' : 'L',
    dynamic: i % 4 === 0 ? 'accent' : 'normal',
  }));
}

function getStepsPerBeat(sub: SubdivisionType): number {
  if (sub === 'triplet') return 3;
  if (sub === 'sextuplet') return 6;
  if (sub === 'quintuplet') return 5;
  if (sub === 'septuplet') return 7;
  if (sub === '32nd') return 8;
  if (sub === 'nonuplet') return 9;
  return 4;
}

export function CustomChopEditorModal({
  initialPattern,
  onSave,
  onAuditionStep,
  onClose,
  t,
}: CustomChopEditorModalProps) {
  const isEditingExistingCustom = Boolean(initialPattern?.isCustom);

  const [title, setTitle] = useState(
    initialPattern
      ? isEditingExistingCustom
        ? initialPattern.title
        : `${initialPattern.title} (Custom)`
      : 'My Custom Linear Chop'
  );
  const [level, setLevel] = useState<DifficultyLevel>(
    initialPattern?.level ?? 2
  );
  const [timeSignature, setTimeSignature] = useState<ChopPattern['timeSignature']>(
    initialPattern?.timeSignature ?? '4/4'
  );
  const [subdivision, setSubdivision] = useState<SubdivisionType>(
    initialPattern?.subdivision ?? '16th'
  );
  const [defaultBpm, setDefaultBpm] = useState<number>(
    initialPattern?.defaultBpm ?? 85
  );
  const [customTip, setCustomTip] = useState<string>(
    initialPattern?.customTip ?? ''
  );
  const [steps, setSteps] = useState<ChopStep[]>(
    initialPattern ? initialPattern.steps.map((s) => ({ ...s })) : buildDefaultSteps(16)
  );

  const handleStepCountChange = (count: number) => {
    setSteps((prev) => {
      if (count === prev.length) return prev;
      if (count < prev.length) return prev.slice(0, count);
      const extra = buildDefaultSteps(count - prev.length);
      return [...prev, ...extra];
    });
  };

  const cycleVoice = (idx: number) => {
    setSteps((prev) => {
      const next = [...prev];
      const cur = next[idx];
      const vIdx = VOICES.indexOf(cur.voice);
      const nextVoice = VOICES[(vIdx + 1) % VOICES.length];
      const nextHand: Hand =
        nextVoice === 'kick'
          ? 'K'
          : nextVoice === 'rest'
          ? '-'
          : cur.hand === 'K' || cur.hand === '-'
          ? idx % 2 === 0
            ? 'R'
            : 'L'
          : cur.hand;
      const nextDyn: DynamicLevel =
        nextVoice === 'rest'
          ? 'rest'
          : cur.dynamic === 'rest'
          ? 'normal'
          : cur.dynamic;
      const updated = { voice: nextVoice, hand: nextHand, dynamic: nextDyn };
      next[idx] = updated;
      onAuditionStep(updated);
      return next;
    });
  };

  const cycleHand = (idx: number) => {
    setSteps((prev) => {
      const next = [...prev];
      const cur = next[idx];
      const hIdx = HANDS.indexOf(cur.hand);
      const nextHand = HANDS[(hIdx + 1) % HANDS.length];
      next[idx] = { ...cur, hand: nextHand };
      return next;
    });
  };

  const cycleDynamic = (idx: number) => {
    setSteps((prev) => {
      const next = [...prev];
      const cur = next[idx];
      const dIdx = DYNAMICS.indexOf(cur.dynamic);
      const nextDyn = DYNAMICS[(dIdx + 1) % DYNAMICS.length];
      const updated = { ...cur, dynamic: nextDyn };
      next[idx] = updated;
      onAuditionStep(updated);
      return next;
    });
  };

  const applyPreset = (kind: 'clear' | 'alt' | 'rlk') => {
    setSteps((prev) =>
      prev.map((_, i) => {
        if (kind === 'clear') {
          return { voice: 'rest', hand: '-', dynamic: 'rest' };
        }
        if (kind === 'alt') {
          return {
            voice: i % 4 === 0 ? 'tom1' : 'snare',
            hand: i % 2 === 0 ? 'R' : 'L',
            dynamic: i % 4 === 0 ? 'accent' : 'normal',
          };
        }
        const mod = i % 3;
        if (mod === 0) return { voice: 'tom1', hand: 'R', dynamic: 'accent' };
        if (mod === 1) return { voice: 'snare', hand: 'L', dynamic: 'ghost' };
        return { voice: 'kick', hand: 'K', dynamic: 'normal' };
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pattern: ChopPattern = {
      id: isEditingExistingCustom && initialPattern
        ? initialPattern.id
        : `custom-${Date.now()}`,
      level,
      title: title.trim() || 'Custom Chop',
      timeSignature,
      subdivision,
      stepsPerBeat: getStepsPerBeat(subdivision),
      defaultBpm: Math.max(40, Math.min(220, defaultBpm)),
      targetBpm: Math.min(220, Math.max(40, defaultBpm + 35)),
      categoryTag: 'Custom Orchestration',
      coachTipKey: 'tip_rebound_even',
      customTip: customTip.trim() || undefined,
      isCustom: true,
      steps,
    };
    onSave(pattern);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-xl"
      >
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditingExistingCustom
              ? t.editor.modalTitleEdit
              : t.editor.modalTitleNew}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.editor.cancel}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <label className="sm:col-span-2 flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>{t.editor.nameLabel}</span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>{t.editor.levelLabel}</span>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value) as DifficultyLevel)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value={1}>L1</option>
              <option value={2}>L2</option>
              <option value={3}>L3</option>
              <option value={4}>L4</option>
              <option value={5}>L5</option>
              <option value={6}>L6</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>{t.editor.subdivisionLabel}</span>
            <select
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value as SubdivisionType)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="16th">{t.subdivisions['16th']}</option>
              <option value="linear">{t.subdivisions.linear}</option>
              <option value="triplet">{t.subdivisions.triplet}</option>
              <option value="sextuplet">{t.subdivisions.sextuplet}</option>
              <option value="quintuplet">{t.subdivisions.quintuplet}</option>
              <option value="septuplet">{t.subdivisions.septuplet}</option>
              <option value="32nd">{t.subdivisions['32nd']}</option>
              <option value="nonuplet">{t.subdivisions.nonuplet}</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>{t.editor.stepsCountLabel}</span>
            <select
              value={steps.length}
              onChange={(e) => handleStepCountChange(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white font-mono-tabular"
            >
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 30, 32, 36, 48].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>{t.editor.timeSigLabel}</span>
            <select
              value={timeSignature}
              onChange={(e) =>
                setTimeSignature(e.target.value as ChopPattern['timeSignature'])
              }
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white font-mono-tabular"
            >
              {(
                ['4/4', '3/4', '6/4', '2/4', '12/8', '6/8', '9/8', '5/8', '7/8', '11/16', '13/16'] as const
              ).map((ts) => (
                <option key={ts} value={ts}>
                  {ts}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>{t.editor.bpmLabel}</span>
            <input
              type="number"
              min={40}
              max={220}
              value={defaultBpm}
              onChange={(e) => setDefaultBpm(Number(e.target.value) || 85)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono-tabular"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>{t.editor.tipLabel}</span>
            <input
              type="text"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="Relax wrist, keep ghosts low..."
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </label>
        </div>

        {/* Presets & Instructions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <p className="text-xs text-slate-500">{t.editor.stepClickHint}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('clear')}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
            >
              {t.editor.presetClear}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('alt')}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
            >
              {t.editor.presetAlternating}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('rlk')}
              className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md"
            >
              {t.editor.presetLinearRlk}
            </button>
          </div>
        </div>

        {/* Interactive Step Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-lg p-2 bg-[#F8FAFC] flex flex-col items-center gap-1.5"
            >
              <span className="font-mono-tabular text-[11px] text-slate-400">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => cycleVoice(idx)}
                className="w-full py-1.5 rounded bg-white border border-slate-200 hover:border-amber-600 font-mono-tabular text-xs font-bold text-slate-900"
              >
                {VOICE_SHORT[step.voice]}
              </button>
              <div className="flex items-center gap-1 w-full">
                <button
                  type="button"
                  onClick={() => cycleHand(idx)}
                  className={`flex-1 py-1 rounded font-mono-tabular text-[11px] font-bold ${
                    step.hand === 'R'
                      ? 'bg-amber-100 text-amber-900'
                      : step.hand === 'L'
                      ? 'bg-indigo-100 text-indigo-900'
                      : step.hand === 'K'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step.hand}
                </button>
                <button
                  type="button"
                  onClick={() => cycleDynamic(idx)}
                  className="flex-1 py-1 rounded bg-white border border-slate-200 font-mono-tabular text-[11px] font-semibold text-slate-700"
                >
                  {step.dynamic === 'accent'
                    ? '>'
                    : step.dynamic === 'ghost'
                    ? '(g)'
                    : step.dynamic === 'rest'
                    ? '—'
                    : '•'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            {t.editor.cancel}
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-[#D97706] hover:bg-amber-700 rounded-lg"
          >
            {t.editor.saveChop}
          </button>
        </div>
      </form>
    </div>
  );
}
