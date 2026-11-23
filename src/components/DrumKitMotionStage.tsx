import type { ChopStep, DrumVoice, DynamicLevel } from '../types/drum';
import type { TranslationBundle } from '../i18n/translations';

interface DrumKitMotionStageProps {
  currentStep: ChopStep | null;
  isPlaying: boolean;
  silentKitMode: boolean;
  onAuditionVoice: (voice: DrumVoice, dynamic?: DynamicLevel) => void;
  t: TranslationBundle;
}

interface PadCoord {
  cx: number;
  cy: number;
  r: number;
  label: string;
}

const PAD_COORDS: Record<Exclude<DrumVoice, 'rest'>, PadCoord> = {
  hihat: { cx: 120, cy: 175, r: 46, label: 'HH' },
  snare: { cx: 215, cy: 252, r: 54, label: 'SNARE' },
  tom1: { cx: 262, cy: 118, r: 42, label: 'T1' },
  tom2: { cx: 378, cy: 118, r: 46, label: 'T2' },
  floor: { cx: 462, cy: 245, r: 56, label: 'FLOOR' },
  crash: { cx: 505, cy: 108, r: 52, label: 'CRASH' },
  kick: { cx: 320, cy: 332, r: 42, label: 'KICK' },
};

const REST_RIGHT = { x: 405, y: 270 };
const REST_LEFT = { x: 225, y: 270 };
const WRIST_RIGHT = { x: 420, y: 392 };
const WRIST_LEFT = { x: 210, y: 392 };

export function DrumKitMotionStage({
  currentStep,
  isPlaying,
  silentKitMode,
  onAuditionVoice,
  t,
}: DrumKitMotionStageProps) {
  const activeVoice = currentStep?.voice ?? 'rest';
  const activeHand = currentStep?.hand ?? '-';
  const activeDynamic = currentStep?.dynamic ?? 'rest';

  const padVoice: Exclude<DrumVoice, 'rest'> | null =
    activeVoice !== 'rest' ? activeVoice : null;
  const isRightActive = activeHand === 'R' && padVoice !== null;
  const isLeftActive = activeHand === 'L' && padVoice !== null;
  const isKickActive = padVoice === 'kick' || activeHand === 'K';

  const rightTarget =
    isRightActive && padVoice
      ? PAD_COORDS[padVoice]
      : { cx: REST_RIGHT.x, cy: REST_RIGHT.y };

  const leftTarget =
    isLeftActive && padVoice
      ? PAD_COORDS[padVoice]
      : { cx: REST_LEFT.x, cy: REST_LEFT.y };

  // Dynamic lift/stroke scale
  const getBurstRadius = (dyn: DynamicLevel) => {
    if (dyn === 'accent') return 26;
    if (dyn === 'normal') return 16;
    return 10;
  };

  const renderDrumCircle = (
    voice: Exclude<DrumVoice, 'rest' | 'kick'>,
    isCymbal: boolean
  ) => {
    const pad = PAD_COORDS[voice];
    const isHit = activeVoice === voice && activeDynamic !== 'rest';
    const isAccent = isHit && activeDynamic === 'accent';
    const isGhost = isHit && activeDynamic === 'ghost';

    const hitColor =
      activeHand === 'L' ? '#4F46E5' : '#D97706';

    return (
      <g
        key={voice}
        onClick={() => onAuditionVoice(voice, 'normal')}
        className="cursor-pointer group"
        role="button"
        tabIndex={0}
        aria-label={t.voices[voice]}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onAuditionVoice(voice, 'normal');
          }
        }}
      >
        {/* Outer rim / shadow */}
        <circle
          cx={pad.cx}
          cy={pad.cy}
          r={pad.r + 4}
          fill={isCymbal ? '#92400E' : '#CBD5E1'}
          opacity={isCymbal ? 0.28 : 0.75}
        />

        {/* Pad body */}
        <circle
          cx={pad.cx}
          cy={pad.cy}
          r={pad.r}
          fill={isCymbal ? 'url(#cymbalGrad)' : 'url(#drumHeadGrad)'}
          stroke={isHit ? hitColor : isCymbal ? '#B45309' : '#64748B'}
          strokeWidth={isHit ? (isAccent ? 4 : 3) : 2}
          className="transition-all duration-75"
        />

        {/* Cymbal lathe rings or drum snare/lug detail */}
        {isCymbal ? (
          <>
            <circle
              cx={pad.cx}
              cy={pad.cy}
              r={pad.r * 0.65}
              fill="none"
              stroke="#B45309"
              strokeOpacity="0.28"
              strokeWidth="1"
            />
            <circle
              cx={pad.cx}
              cy={pad.cy}
              r={9}
              fill="#B45309"
              opacity="0.7"
            />
            <circle cx={pad.cx} cy={pad.cy} r={3} fill="#F8FAFC" />
          </>
        ) : (
          <circle
            cx={pad.cx}
            cy={pad.cy}
            r={pad.r * 0.84}
            fill="none"
            stroke="#94A3B8"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        )}

        {/* Active hit shockwave */}
        {isHit && (
          <circle
            cx={pad.cx}
            cy={pad.cy}
            r={pad.r * 0.45 + getBurstRadius(activeDynamic)}
            fill={hitColor}
            fillOpacity={isAccent ? 0.22 : isGhost ? 0.08 : 0.14}
            stroke={hitColor}
            strokeWidth={isAccent ? 2.5 : 1.5}
            strokeDasharray={isGhost ? '4 3' : undefined}
          />
        )}

        {/* Label */}
        <text
          x={pad.cx}
          y={pad.cy + pad.r - 12}
          textAnchor="middle"
          className="select-none pointer-events-none font-mono-tabular text-[10px] font-bold tracking-wider"
          fill={isHit ? '#0F172A' : '#475569'}
        >
          {pad.label}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {t.stage.kitTitle}
          </h2>
          <p className="text-xs text-slate-500">{t.stage.clickPadHint}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706] inline-block" />
            <span>{t.stage.rightHand}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#4F46E5] inline-block" />
            <span>{t.stage.leftHand}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#059669] inline-block" />
            <span>{t.stage.kickFoot}</span>
          </span>
        </div>
      </div>

      <div className="relative w-full bg-[#F8FAFC] border border-slate-200/80 rounded-lg overflow-hidden">
        {silentKitMode && (
          <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-xs font-medium text-amber-900 text-center">
            {t.controls.silentKit} · {t.controls.silentKitHint}
          </div>
        )}

        <svg
          viewBox="0 0 640 390"
          className="w-full h-auto max-h-[340px] block select-none"
          role="img"
          aria-label={t.stage.kitTitle}
        >
          <defs>
            <radialGradient id="drumHeadGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </radialGradient>
            <radialGradient id="cymbalGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="55%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.45" />
            </radialGradient>
            <pattern
              id="studioGrid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>

          {/* Subtle Blueprint Studio Grid */}
          <rect width="640" height="390" fill="url(#studioGrid)" />

          {/* Bass / Kick Drum Shell (Top-Down) */}
          <g
            onClick={() => onAuditionVoice('kick', 'normal')}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={t.voices.kick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAuditionVoice('kick', 'normal');
              }
            }}
          >
            <rect
              x="252"
              y="265"
              width="136"
              height="74"
              rx="10"
              fill="#1E293B"
              stroke={isKickActive ? '#059669' : '#475569'}
              strokeWidth={isKickActive ? 3.5 : 2}
            />
            <rect
              x="260"
              y="272"
              width="120"
              height="60"
              rx="6"
              fill="#0F172A"
            />
            {/* Kick pedal footboard */}
            <rect
              x="306"
              y="328"
              width="28"
              height="48"
              rx="5"
              fill={isKickActive ? '#059669' : '#64748B'}
              className="transition-colors duration-75"
            />
            {/* Animated Kick Beater */}
            <line
              x1="320"
              y1="332"
              x2="320"
              y2={isKickActive ? 296 : 316}
              stroke="#E2E8F0"
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-all duration-75"
            />
            <circle
              cx="320"
              cy={isKickActive ? 294 : 316}
              r={isKickActive ? 9 : 6}
              fill={isKickActive ? '#10B981' : '#CBD5E1'}
            />
            {isKickActive && (
              <ellipse
                cx="320"
                cy="302"
                rx={activeDynamic === 'accent' ? 56 : 42}
                ry={activeDynamic === 'accent' ? 24 : 18}
                fill="#059669"
                fillOpacity="0.22"
                stroke="#10B981"
                strokeWidth="2"
              />
            )}
            <text
              x="320"
              y="286"
              textAnchor="middle"
              className="font-mono-tabular text-[10px] font-bold tracking-wider fill-slate-300 pointer-events-none"
            >
              KICK (K)
            </text>
          </g>

          {/* Drums & Cymbals */}
          {renderDrumCircle('hihat', true)}
          {renderDrumCircle('crash', true)}
          {renderDrumCircle('tom1', false)}
          {renderDrumCircle('tom2', false)}
          {renderDrumCircle('snare', false)}
          {renderDrumCircle('floor', false)}

          {/* Left Stick (Indigo #4F46E5) */}
          <g
            style={{
              transition: isPlaying
                ? 'all 60ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'all 180ms ease-out',
            }}
          >
            {/* Stick shadow */}
            <line
              x1={WRIST_LEFT.x + 4}
              y1={WRIST_LEFT.y + 6}
              x2={leftTarget.cx + 4}
              y2={leftTarget.cy + 6}
              stroke="#0F172A"
              strokeOpacity="0.12"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Hickory shaft */}
            <line
              x1={WRIST_LEFT.x}
              y1={WRIST_LEFT.y}
              x2={leftTarget.cx}
              y2={leftTarget.cy}
              stroke="#4338CA"
              strokeWidth={isLeftActive && activeDynamic === 'accent' ? 7 : 5.5}
              strokeLinecap="round"
            />
            {/* Stick Tip */}
            <circle
              cx={leftTarget.cx}
              cy={leftTarget.cy}
              r={isLeftActive ? (activeDynamic === 'accent' ? 9 : 7) : 5}
              fill="#4F46E5"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={leftTarget.cx - 14}
              y={leftTarget.cy - 12}
              textAnchor="middle"
              className="font-mono-tabular text-[11px] font-bold fill-[#4F46E5] pointer-events-none"
            >
              L
            </text>
          </g>

          {/* Right Stick (Amber #D97706) */}
          <g
            style={{
              transition: isPlaying
                ? 'all 60ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'all 180ms ease-out',
            }}
          >
            <line
              x1={WRIST_RIGHT.x + 4}
              y1={WRIST_RIGHT.y + 6}
              x2={rightTarget.cx + 4}
              y2={rightTarget.cy + 6}
              stroke="#0F172A"
              strokeOpacity="0.12"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1={WRIST_RIGHT.x}
              y1={WRIST_RIGHT.y}
              x2={rightTarget.cx}
              y2={rightTarget.cy}
              stroke="#B45309"
              strokeWidth={isRightActive && activeDynamic === 'accent' ? 7 : 5.5}
              strokeLinecap="round"
            />
            <circle
              cx={rightTarget.cx}
              cy={rightTarget.cy}
              r={isRightActive ? (activeDynamic === 'accent' ? 9 : 7) : 5}
              fill="#D97706"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={rightTarget.cx + 14}
              y={rightTarget.cy - 12}
              textAnchor="middle"
              className="font-mono-tabular text-[11px] font-bold fill-[#D97706] pointer-events-none"
            >
              R
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
