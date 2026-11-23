export type DrumVoice =
  | 'kick'
  | 'snare'
  | 'tom1'
  | 'tom2'
  | 'floor'
  | 'hihat'
  | 'crash'
  | 'rest';

export type Hand = 'R' | 'L' | 'K' | '-';

export type DynamicLevel = 'accent' | 'normal' | 'ghost' | 'rest';

export type SubdivisionType =
  | '16th'
  | 'triplet'
  | 'sextuplet'
  | 'quintuplet'
  | 'septuplet'
  | '32nd'
  | 'nonuplet'
  | 'linear';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface ChopStep {
  voice: DrumVoice;
  hand: Hand;
  dynamic: DynamicLevel;
}

export interface ChopPattern {
  id: string;
  level: DifficultyLevel;
  title: string;
  timeSignature:
    | '4/4'
    | '3/4'
    | '6/4'
    | '2/4'
    | '5/8'
    | '7/8'
    | '6/8'
    | '9/8'
    | '12/8'
    | '11/16'
    | '13/16';
  subdivision: SubdivisionType;
  /** Number of steps per quarter-note beat (4 for 16ths, 3 for triplets, 6 for sextuplets, 5 for quintuplets, 7 for septuplets, 2 for 8ths) */
  stepsPerBeat: number;
  defaultBpm: number;
  targetBpm: number;
  categoryTag: string;
  coachTipKey: string;
  customTip?: string;
  isCustom?: boolean;
  steps: ChopStep[];
}

export interface RampConfig {
  enabled: boolean;
  stepBpm: number;
  everyBars: number;
  targetBpm: number;
}

export type SpeedMultiplier = 0.5 | 0.75 | 1 | 1.25;

export interface DrumProfile {
  id: string;
  name: string;
  createdAt: string;
  practicedChopIds: string[];
  masteredChopIds: string[];
  bestBpmByChop: Record<string, number>;
  totalPracticeSeconds: number;
  streakDays: number;
  lastPracticeDate: string | null;
  customChops: ChopPattern[];
}

export interface ProfileStore {
  version: 1;
  activeProfileId: string;
  profiles: DrumProfile[];
}

export type PracticeMode = 'trainer' | 'real-example';

export type BackingInstrument =
  | 'both'
  | 'acoustic-piano'
  | 'piano'
  | 'electronic'
  | 'off';

export type PlayPhase = 'groove' | 'chop';
