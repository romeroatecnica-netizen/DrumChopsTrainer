import {
  CheckCircle2,
  CopyPlus,
  Minus,
  Music2,
  Play,
  Plus,
  Repeat,
  Square,
  TrendingUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type {
  BackingInstrument,
  ChopPattern,
  PlayPhase,
  PracticeMode,
  RampConfig,
  SpeedMultiplier,
} from '../types/drum';
import type { TranslationBundle } from '../i18n/translations';

interface TransportControlsProps {
  pattern: ChopPattern;
  practiceMode: PracticeMode;
  backingInstrument: BackingInstrument;
  grooveBarsCount: number;
  playPhase: PlayPhase;
  phaseBarIndex: number;
  phaseTotalBars: number;
  isPlaying: boolean;
  bpm: number;
  speedMultiplier: SpeedMultiplier;
  loop: boolean;
  metronomeEnabled: boolean;
  soloClick: boolean;
  muteClick: boolean;
  silentKitMode: boolean;
  volume: number;
  currentBar: number;
  currentStepIndex: number;
  activeStepsTotal: number;
  ramp: RampConfig;
  isMastered: boolean;
  bestBpm: number | undefined;
  viewMode: 'both' | 'kit' | 'grid';
  onPracticeModeChange: (mode: PracticeMode) => void;
  onBackingInstrumentChange: (inst: BackingInstrument) => void;
  onGrooveBarsChange: (bars: number) => void;
  onTogglePlay: () => void;
  onBpmChange: (nextBpm: number) => void;
  onSpeedChange: (mult: SpeedMultiplier) => void;
  onToggleLoop: () => void;
  onToggleMetronome: () => void;
  onToggleSoloClick: () => void;
  onToggleMuteClick: () => void;
  onToggleSilentKit: () => void;
  onVolumeChange: (val: number) => void;
  onRampChange: (next: RampConfig) => void;
  onToggleMastered: () => void;
  onDuplicateEdit: () => void;
  onViewModeChange: (mode: 'both' | 'kit' | 'grid') => void;
  t: TranslationBundle;
}

const SPEED_OPTIONS: SpeedMultiplier[] = [0.5, 0.75, 1, 1.25];

export function TransportControls({
  pattern,
  practiceMode,
  backingInstrument,
  grooveBarsCount,
  playPhase,
  phaseBarIndex,
  phaseTotalBars,
  isPlaying,
  bpm,
  speedMultiplier,
  loop,
  metronomeEnabled,
  soloClick,
  muteClick,
  silentKitMode,
  volume,
  currentBar,
  currentStepIndex,
  activeStepsTotal,
  ramp,
  isMastered,
  bestBpm,
  viewMode,
  onPracticeModeChange,
  onBackingInstrumentChange,
  onGrooveBarsChange,
  onTogglePlay,
  onBpmChange,
  onSpeedChange,
  onToggleLoop,
  onToggleMetronome,
  onToggleSoloClick,
  onToggleMuteClick,
  onToggleSilentKit,
  onVolumeChange,
  onRampChange,
  onToggleMastered,
  onDuplicateEdit,
  onViewModeChange,
  t,
}: TransportControlsProps) {
  const effectiveBpm = Math.round(bpm * speedMultiplier);
  const barsUntilNextBump =
    ramp.enabled && ramp.everyBars > 0
      ? ramp.everyBars - ((currentBar - 1) % ramp.everyBars)
      : null;

  return (
    <section
      aria-label={pattern.title}
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4"
    >
      {/* Studio Mode Tabs + Pattern Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-2">
          {/* Practice Trainer vs Real Musical Example Tab Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => onPracticeModeChange('trainer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                practiceMode === 'trainer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.realExample.tabTrainer}
            </button>
            <button
              type="button"
              onClick={() => onPracticeModeChange('real-example')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                practiceMode === 'real-example'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>{t.realExample.tabRealExample}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-amber-700">
              L{pattern.level}
            </span>
            <span aria-hidden="true">·</span>
            <span>{pattern.categoryTag}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{pattern.timeSignature}</span>
            <span aria-hidden="true">·</span>
            <span>{t.subdivisions[pattern.subdivision]}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular text-slate-700 font-medium">
              {t.realExample.realSpeedLabel}: {pattern.targetBpm} BPM
            </span>
            {bestBpm ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular text-emerald-700 font-medium">
                  {t.controls.bestBpm}: {bestBpm} BPM
                </span>
              </>
            ) : null}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {pattern.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Segmented Control */}
          <div
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
            role="group"
          >
            {(['both', 'kit', 'grid'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'both'
                  ? t.controls.viewBoth
                  : mode === 'kit'
                  ? t.controls.viewKit
                  : t.controls.viewGrid}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onDuplicateEdit}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <CopyPlus className="w-3.5 h-3.5" />
            <span>{t.controls.duplicateEdit}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMastered}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isMastered
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                isMastered ? 'text-emerald-600' : 'text-slate-400'
              }`}
            />
            <span>{isMastered ? t.controls.mastered : t.controls.markMastered}</span>
          </button>
        </div>
      </div>

      {/* Main Transport + BPM Control Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
        {/* Play / Loop / Audio Modes (5 cols) */}
        <div className="xl:col-span-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[42px] ${
              isPlaying
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-[#D97706] text-white hover:bg-amber-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>{t.controls.stop}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{t.controls.play}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleLoop}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              loop
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{t.controls.loop}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMetronome}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              metronomeEnabled && !muteClick
                ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {t.controls.metronome}
          </button>

          <button
            type="button"
            onClick={onToggleSoloClick}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              soloClick
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {t.controls.soloClick}
          </button>

          <button
            type="button"
            onClick={onToggleMuteClick}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              muteClick
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {t.controls.muteClick}
          </button>

          <button
            type="button"
            onClick={onToggleSilentKit}
            title={t.controls.silentKitHint}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              silentKitMode
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {t.controls.silentKit}
          </button>
        </div>

        {/* BPM Slider + Quick Nudge + Speed Multiplier (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                {t.controls.bpm}
              </span>
              <span className="font-mono-tabular text-xl font-bold text-slate-900">
                {bpm}
              </span>
              {speedMultiplier !== 1 && (
                <span className="font-mono-tabular text-xs font-semibold text-amber-700">
                  ({t.controls.effectiveBpm}: {effectiveBpm})
                </span>
              )}
              {bpm !== pattern.targetBpm && (
                <button
                  type="button"
                  onClick={() => {
                    onBpmChange(pattern.targetBpm);
                    onSpeedChange(1);
                  }}
                  className="text-[11px] font-mono-tabular font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2"
                >
                  → {pattern.targetBpm}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onBpmChange(bpm - 5)}
                className="px-2 py-1 text-xs font-mono-tabular font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => onBpmChange(bpm - 1)}
                aria-label="Decrease BPM"
                className="p-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onBpmChange(bpm + 1)}
                aria-label="Increase BPM"
                className="p-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onBpmChange(bpm + 5)}
                className="px-2 py-1 text-xs font-mono-tabular font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                +5
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="range"
              min={40}
              max={220}
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              aria-label={t.controls.bpm}
              className="chopcue-slider flex-1 min-w-[140px]"
            />

            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
              {SPEED_OPTIONS.map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => onSpeedChange(mult)}
                  className={`px-2 py-1 text-xs font-mono-tabular font-medium rounded-md transition-colors ${
                    speedMultiplier === mult
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Volume & Bar/Step Telemetry (2 cols) */}
        <div className="xl:col-span-2 flex xl:flex-col items-center xl:items-end justify-between gap-2">
          <div className="flex items-center gap-2 w-36 xl:w-full">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
              aria-label={t.controls.volume}
              className="chopcue-slider w-full"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 font-mono-tabular">
            <span>
              {t.controls.bar}{' '}
              <strong className="text-slate-900">{currentBar}</strong>
            </span>
            <span>
              {t.controls.step}{' '}
              <strong className="text-slate-900">
                {currentStepIndex + 1}/{activeStepsTotal}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Deck: Auto BPM Ramp (Trainer Mode) OR Backing + Phase Loop (Real Example Mode) */}
      {practiceMode === 'trainer' ? (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onRampChange({ ...ramp, enabled: !ramp.enabled })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg border transition-colors ${
                ramp.enabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.controls.rampTitle}</span>
            </button>

            <label className="inline-flex items-center gap-1.5 text-slate-600">
              <span>{t.controls.rampStep}</span>
              <input
                type="number"
                min={1}
                max={20}
                value={ramp.stepBpm}
                onChange={(e) =>
                  onRampChange({
                    ...ramp,
                    stepBpm: Math.max(
                      1,
                      Math.min(20, Number(e.target.value) || 1)
                    ),
                  })
                }
                className="w-14 px-2 py-1 border border-slate-200 rounded-md font-mono-tabular text-slate-900 text-center bg-white"
              />
            </label>

            <label className="inline-flex items-center gap-1.5 text-slate-600">
              <span>{t.controls.rampEvery}</span>
              <input
                type="number"
                min={1}
                max={32}
                value={ramp.everyBars}
                onChange={(e) =>
                  onRampChange({
                    ...ramp,
                    everyBars: Math.max(
                      1,
                      Math.min(32, Number(e.target.value) || 1)
                    ),
                  })
                }
                className="w-14 px-2 py-1 border border-slate-200 rounded-md font-mono-tabular text-slate-900 text-center bg-white"
              />
              <span>{t.controls.rampBarsUnit}</span>
            </label>

            <label className="inline-flex items-center gap-1.5 text-slate-600">
              <span>{t.controls.rampTarget}</span>
              <input
                type="number"
                min={40}
                max={220}
                value={ramp.targetBpm}
                onChange={(e) =>
                  onRampChange({
                    ...ramp,
                    targetBpm: Math.max(
                      40,
                      Math.min(220, Number(e.target.value) || 120)
                    ),
                  })
                }
                className="w-16 px-2 py-1 border border-slate-200 rounded-md font-mono-tabular text-slate-900 text-center bg-white"
              />
            </label>
          </div>

          {ramp.enabled && isPlaying && barsUntilNextBump !== null && (
            <span className="font-mono-tabular text-emerald-700 font-medium">
              {t.controls.rampNextIn} {barsUntilNextBump}{' '}
              {t.controls.rampBarsUnit}
            </span>
          )}
        </div>
      ) : (
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Backing Loop Instrument Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700">
                {t.realExample.backingLabel}:
              </span>
              <div className="inline-flex flex-wrap items-center p-0.5 bg-slate-100 rounded-lg">
                {(
                  [
                    { key: 'both', label: t.realExample.backingBoth },
                    {
                      key: 'acoustic-piano',
                      label: t.realExample.backingAcousticPiano,
                    },
                    { key: 'piano', label: t.realExample.backingPiano },
                    {
                      key: 'electronic',
                      label: t.realExample.backingElectronic,
                    },
                    { key: 'off', label: t.realExample.backingOff },
                  ] as Array<{ key: BackingInstrument; label: string }>
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onBackingInstrumentChange(item.key)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      backingInstrument === item.key
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-Chop Base Groove Bar Count */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">
                {t.realExample.grooveBarsLabel}:
              </span>
              <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
                {[1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onGrooveBarsChange(count)}
                    className={`px-2.5 py-1 text-xs font-mono-tabular font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      grooveBarsCount === count
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {count}{' '}
                    {count === 1
                      ? t.realExample.barUnit
                      : t.realExample.barsUnit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Musical Phase Timeline (Groove Bars -> Chop Fill -> Resolve) */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F8FAFC] border border-slate-200/80 rounded-lg px-3 py-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: grooveBarsCount }, (_, i) => {
                const barNum = i + 1;
                const active =
                  playPhase === 'groove' && phaseBarIndex === barNum;
                return (
                  <span
                    key={barNum}
                    className={`font-mono-tabular px-2.5 py-1 rounded-md border transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {t.realExample.phaseGroove} {barNum}/{phaseTotalBars}
                  </span>
                );
              })}

              <span className="text-slate-400" aria-hidden="true">
                →
              </span>

              <span
                className={`font-mono-tabular px-2.5 py-1 rounded-md border transition-colors ${
                  playPhase === 'chop'
                    ? 'bg-[#D97706] text-white border-[#D97706] font-semibold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {t.realExample.phaseChop}
              </span>

              <span className="text-slate-400" aria-hidden="true">
                →
              </span>

              <span className="font-mono-tabular px-2 py-1 text-emerald-700 font-semibold">
                {t.realExample.phaseResolve}
              </span>
            </div>

            <p className="text-slate-500">{t.realExample.hint}</p>
          </div>
        </div>
      )}
    </section>
  );
}
