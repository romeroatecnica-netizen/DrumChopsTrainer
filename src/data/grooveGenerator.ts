import type { ChopPattern, ChopStep } from '../types/drum';

const s = (
  voice: ChopStep['voice'],
  hand: ChopStep['hand'],
  dynamic: ChopStep['dynamic'] = 'normal'
): ChopStep => ({ voice, hand, dynamic });

/**
 * Generates an authentic, time-signature-matched Base Groove pattern
 * for any chop so "Real Musical Example" plays Groove -> Chop Fill -> Groove seamlessly.
 */
export function buildBaseGrooveForChop(chop: ChopPattern): ChopPattern {
  const totalSteps = chop.steps.length;
  const spb = Math.max(1, chop.stepsPerBeat);
  const steps: ChopStep[] = [];

  if (chop.timeSignature === '7/8' && totalSteps === 14) {
    // 7/8 pocket: 2 + 2 + 3 grouping (steps 0..3 | 4..7 | 8..13)
    for (let i = 0; i < 14; i++) {
      if (i === 0 || i === 8) steps.push(s('kick', 'K', 'accent'));
      else if (i === 4 || i === 12) steps.push(s('snare', 'L', 'accent'));
      else if (i % 2 === 0) steps.push(s('hihat', 'R', 'normal'));
      else if (i === 7 || i === 11) steps.push(s('snare', 'L', 'ghost'));
      else steps.push(s('rest', '-', 'rest'));
    }
  } else if (chop.timeSignature === '5/8' && totalSteps === 10) {
    // 5/8 pocket: 3 + 2 grouping (steps 0..5 | 6..9)
    for (let i = 0; i < 10; i++) {
      if (i === 0 || i === 6) steps.push(s('kick', 'K', 'accent'));
      else if (i === 4 || i === 8) steps.push(s('snare', 'L', 'accent'));
      else if (i % 2 === 0) steps.push(s('hihat', 'R', 'normal'));
      else steps.push(s('rest', '-', 'rest'));
    }
  } else if (chop.timeSignature === '11/16') {
    // 11/16 pocket: 3 + 3 + 3 + 2 grouping
    for (let i = 0; i < totalSteps; i++) {
      const m = i % 11;
      if (m === 0 || m === 6) steps.push(s('kick', 'K', 'accent'));
      else if (m === 3 || m === 9) steps.push(s('snare', 'L', 'accent'));
      else if (m % 2 === 0) steps.push(s('hihat', 'R', 'normal'));
      else if (m === 5 || m === 10) steps.push(s('snare', 'L', 'ghost'));
      else steps.push(s('rest', '-', 'rest'));
    }
  } else if (chop.timeSignature === '13/16' && totalSteps === 13) {
    // 13/16 pocket: 3 + 3 + 3 + 2 + 2 grouping
    for (let i = 0; i < 13; i++) {
      if (i === 0 || i === 6 || i === 11) steps.push(s('kick', 'K', 'accent'));
      else if (i === 3 || i === 9) steps.push(s('snare', 'L', 'accent'));
      else if (i % 2 === 0) steps.push(s('hihat', 'R', 'normal'));
      else steps.push(s('rest', '-', 'rest'));
    }
  } else if (chop.timeSignature === '6/8' || chop.timeSignature === '9/8') {
    // Compound 6/8 or 9/8 pocket
    for (let i = 0; i < totalSteps; i++) {
      const beatIdx = Math.floor(i / spb);
      const sub = i % spb;
      if (i === 0) steps.push(s('kick', 'K', 'accent'));
      else if (beatIdx === 1 && sub === 0) steps.push(s('snare', 'L', 'accent'));
      else if (beatIdx === 2 && sub === 0) steps.push(s('kick', 'K', 'normal'));
      else if (sub === Math.floor(spb / 2)) steps.push(s('hihat', 'R', 'normal'));
      else if (sub === spb - 1) steps.push(s('snare', 'L', 'ghost'));
      else if (sub === 0) steps.push(s('hihat', 'R', 'accent'));
      else steps.push(s('rest', '-', 'rest'));
    }
  } else {
    // Standard 4/4, 3/4, or 2/4 pocket matching exact stepsPerBeat (4, 3, 5, 6, 7, 8, 9)
    const totalBeats = Math.max(1, Math.round(totalSteps / spb));
    for (let i = 0; i < totalSteps; i++) {
      const beatIdx = Math.floor(i / spb);
      const sub = i % spb;
      const halfBeat = Math.floor(spb / 2);

      // Beat 1: Kick downbeat
      if (beatIdx % 4 === 0 && sub === 0) {
        steps.push(s('kick', 'K', 'accent'));
      }
      // Beat 2 / 4: Crisp Snare backbeat
      else if ((beatIdx % 4 === 1 || beatIdx % 4 === 3) && sub === 0) {
        steps.push(s('snare', 'L', 'accent'));
      }
      // Beat 3: Syncopated Kick or beat-3 kick
      else if (beatIdx % 4 === 2 && sub === 0) {
        steps.push(s('kick', 'K', 'accent'));
      }
      // Syncopated kick pickup on "&" of beat 2 or "a" of beat 3 when spb >= 4
      else if (totalBeats >= 4 && beatIdx % 4 === 2 && sub === halfBeat) {
        steps.push(s('kick', 'K', 'normal'));
      }
      // Subtle pocket ghost note on snare before beat 3 or beat 4
      else if (
        spb >= 4 &&
        (beatIdx % 4 === 1 || beatIdx % 4 === 3) &&
        sub === spb - 1
      ) {
        steps.push(s('snare', 'L', 'ghost'));
      }
      // Steady Hi-Hat pulse on 8th-note grid
      else if (sub === 0 || (spb >= 4 && sub === halfBeat)) {
        steps.push(s('hihat', 'R', sub === 0 ? 'accent' : 'normal'));
      } else if (spb === 3 && (sub === 1 || sub === 2)) {
        steps.push(sub === 2 ? s('hihat', 'R', 'normal') : s('rest', '-', 'rest'));
      } else {
        steps.push(s('rest', '-', 'rest'));
      }
    }
  }

  return {
    ...chop,
    id: `${chop.id}__base-groove`,
    title: `${chop.title} — Base Groove`,
    steps,
  };
}
