import type {
  ChopPattern,
  ChopStep,
  DrumVoice,
  Hand,
  PlayPhase,
  PracticeMode,
} from '../types/drum';
import type { TranslationBundle } from '../i18n/translations';

interface RhythmGridSequencerProps {
  pattern: ChopPattern;
  practiceMode?: PracticeMode;
  playPhase?: PlayPhase;
  activeStepIndex: number;
  inspectedStepIndex: number;
  isPlaying: boolean;
  onSelectStep: (index: number) => void;
  t: TranslationBundle;
}

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

function getSubdivisionCountLabel(
  index: number,
  stepsPerBeat: number
): string {
  const beatNum = Math.floor(index / stepsPerBeat) + 1;
  const sub = index % stepsPerBeat;
  if (sub === 0) return String(beatNum);
  if (stepsPerBeat === 4) {
    return ['e', '&', 'a'][sub - 1] ?? '·';
  }
  if (stepsPerBeat === 3) {
    return ['&', 'a'][sub - 1] ?? '·';
  }
  if (stepsPerBeat === 6) {
    return ['t', 'l', '&', 't', 'l'][sub - 1] ?? '·';
  }
  if (stepsPerBeat === 8) {
    return ['.', 'e', '.', '&', '.', 'a', '.'][sub - 1] ?? '·';
  }
  return String(sub + 1);
}

function getGridColumnCount(stepsLength: number, stepsPerBeat: number): number {
  if (stepsLength <= 16) return stepsLength;
  if (stepsLength === 18) return 9;
  if (stepsLength === 20) return 10;
  if (stepsLength === 22) return 11;
  if (stepsLength === 24) return 12;
  if (stepsLength === 28) return 14;
  if (stepsLength === 30) return 15;
  if (stepsLength === 36) return stepsPerBeat === 9 ? 9 : 12;
  if (stepsLength === 48) return stepsPerBeat === 8 ? 16 : 12;
  return 16;
}

function getHandClasses(hand: Hand, isActive: boolean): string {
  if (hand === 'R') {
    return isActive
      ? 'bg-amber-600 text-white'
      : 'bg-amber-50 text-amber-800 border border-amber-200';
  }
  if (hand === 'L') {
    return isActive
      ? 'bg-indigo-600 text-white'
      : 'bg-indigo-50 text-indigo-800 border border-indigo-200';
  }
  if (hand === 'K') {
    return isActive
      ? 'bg-emerald-600 text-white'
      : 'bg-emerald-50 text-emerald-800 border border-emerald-200';
  }
  return 'bg-slate-100 text-slate-400 border border-slate-200';
}

export function RhythmGridSequencer({
  pattern,
  practiceMode = 'trainer',
  playPhase = 'chop',
  activeStepIndex,
  inspectedStepIndex,
  isPlaying,
  onSelectStep,
  t,
}: RhythmGridSequencerProps) {
  const displayIndex = isPlaying ? activeStepIndex : inspectedStepIndex;
  const inspectedStep: ChopStep | undefined =
    pattern.steps[displayIndex] ?? pattern.steps[0];
  const tipText =
    pattern.customTip?.trim() ||
    t.tips[pattern.coachTipKey] ||
    t.tips.tip_rebound_even;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              {t.stage.gridTitle}
            </h2>
            {practiceMode === 'real-example' && (
              <span
                className={`text-xs font-semibold ${
                  playPhase === 'groove' ? 'text-indigo-700' : 'text-amber-700'
                }`}
              >
                ·{' '}
                {playPhase === 'groove'
                  ? t.realExample.phaseGroove
                  : t.realExample.phaseChop}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {pattern.timeSignature} · {t.subdivisions[pattern.subdivision]} ·{' '}
            <span className="font-mono-tabular">{pattern.steps.length}</span>{' '}
            {t.library.stepsLabel}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono-tabular">
          <span>&gt; {t.stage.accentLabel}</span>
          <span>• {t.stage.normalLabel}</span>
          <span>(g) {t.stage.ghostLabel}</span>
        </div>
      </div>

      {/* Step Matrix */}
      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-1.5 min-w-[540px]"
          style={{
            gridTemplateColumns: `repeat(${getGridColumnCount(
              pattern.steps.length,
              pattern.stepsPerBeat
            )}, minmax(0, 1fr))`,
          }}
        >
          {pattern.steps.map((step, idx) => {
            const isBeatStart = idx % pattern.stepsPerBeat === 0;
            const isCursor = isPlaying && activeStepIndex === idx;
            const isInspected = !isPlaying && inspectedStepIndex === idx;

            const dynamicSymbol =
              step.dynamic === 'accent'
                ? '>'
                : step.dynamic === 'ghost'
                ? '(g)'
                : step.dynamic === 'rest'
                ? '—'
                : '•';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectStep(idx)}
                className={`group flex flex-col items-center justify-between py-2 px-1 rounded-lg border transition-all duration-75 focus-visible:outline-2 focus-visible:outline-amber-600 ${
                  isCursor
                    ? 'border-amber-600 bg-amber-50/90 shadow-sm ring-2 ring-amber-500/30 -translate-y-0.5'
                    : isInspected
                    ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500/25'
                    : isBeatStart
                    ? 'border-slate-300 bg-slate-50/80 hover:border-slate-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                aria-label={`${t.controls.step} ${idx + 1}: ${
                  t.voices[step.voice]
                } ${step.hand}`}
              >
                {/* Beat / Subdivision Counter */}
                <span
                  className={`font-mono-tabular text-[11px] leading-none mb-1 ${
                    isBeatStart
                      ? 'font-bold text-slate-900'
                      : 'font-medium text-slate-400'
                  }`}
                >
                  {getSubdivisionCountLabel(idx, pattern.stepsPerBeat)}
                </span>

                {/* Dynamic Accent / Ghost Marker */}
                <span
                  className={`font-mono-tabular text-[11px] h-4 leading-4 ${
                    step.dynamic === 'accent'
                      ? 'font-bold text-amber-700'
                      : step.dynamic === 'ghost'
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {dynamicSymbol}
                </span>

                {/* Drum Voice Code */}
                <span
                  className={`font-mono-tabular text-xs font-bold my-1 ${
                    step.voice === 'rest' ? 'text-slate-300' : 'text-slate-800'
                  }`}
                >
                  {VOICE_SHORT[step.voice]}
                </span>

                {/* Limb / Hand Tag */}
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono-tabular text-xs font-bold ${getHandClasses(
                    step.hand,
                    isCursor
                  )}`}
                >
                  {step.hand}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspected Step & Coach Tip Strip */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
        {inspectedStep && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              {t.stage.selectedStep}{' '}
              <span className="font-mono-tabular">#{displayIndex + 1}</span>
            </span>
            <span>
              {t.stage.voiceLabel}:{' '}
              <strong className="text-slate-900">
                {t.voices[inspectedStep.voice]}
              </strong>
            </span>
            <span>
              {t.stage.handLabel}:{' '}
              <strong className="font-mono-tabular text-slate-900">
                {inspectedStep.hand}
              </strong>
            </span>
            <span>
              {t.stage.dynamicLabel}:{' '}
              <strong className="text-slate-900">
                {inspectedStep.dynamic === 'accent'
                  ? t.stage.accentLabel
                  : inspectedStep.dynamic === 'ghost'
                  ? t.stage.ghostLabel
                  : inspectedStep.dynamic === 'rest'
                  ? t.stage.restLabel
                  : t.stage.normalLabel}
              </strong>
            </span>
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">
            {t.stage.coachTipLabel}:{' '}
          </span>
          {tipText}
        </p>
      </div>
    </div>
  );
}
