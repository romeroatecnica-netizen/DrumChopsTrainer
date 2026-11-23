import { buildBaseGrooveForChop } from '../data/grooveGenerator';
import type {
  BackingInstrument,
  ChopPattern,
  ChopStep,
  DrumVoice,
  DynamicLevel,
  PlayPhase,
  PracticeMode,
  RampConfig,
  SpeedMultiplier,
} from '../types/drum';

export interface EngineCallbacks {
  onStep: (
    stepIndex: number,
    barCount: number,
    isBeatStart: boolean,
    phase: PlayPhase,
    phaseBarIndex: number,
    phaseTotalBars: number
  ) => void;
  onBarComplete: (
    barCount: number,
    phase: PlayPhase,
    updatedBpm?: number
  ) => void;
  onStop: () => void;
}

// MIDI-to-Hz helper
const m2f = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

// 4-bar Neo-Soul / Fusion progression (Dm9 -> G13 -> Cmaj9 -> A7alt)
const PIANO_CHORDS_MIDI: number[][] = [
  [50, 53, 57, 60, 64], // Dm9
  [43, 53, 57, 59, 64], // G13
  [48, 52, 55, 59, 62], // Cmaj9
  [45, 55, 58, 61, 64], // A7b9/13
];

const BASS_ROOTS_MIDI: number[] = [38, 43, 36, 45]; // D2, G2, C2, A2
const BASS_FIFTHS_MIDI: number[] = [45, 50, 43, 52]; // A2, D3, G2, E3

/**
 * Deterministic 100% client-side Web Audio percussion + backing track synthesizer.
 * Supports isolated Chop Trainer mode and Real Musical Example mode
 * (Base Groove bars -> Chop Fill -> Resolve) with Electric Piano & Electronic Synth.
 */
export class DrumAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private isPlaying = false;
  private timerId: number | null = null;
  private rafId: number | null = null;

  private pattern: ChopPattern | null = null;
  private baseGroovePattern: ChopPattern | null = null;
  private practiceMode: PracticeMode = 'trainer';
  private backingInstrument: BackingInstrument = 'both';
  private grooveBarsCount = 2;

  private bpm = 90;
  private speedMultiplier: SpeedMultiplier = 1;
  private loop = true;
  private metronomeEnabled = true;
  private soloClick = false;
  private muteClick = false;
  private silentKitMode = false;
  private volume = 0.85;
  private ramp: RampConfig = {
    enabled: false,
    stepBpm: 4,
    everyBars: 4,
    targetBpm: 130,
  };

  private currentStep = 0;
  private barCount = 1;
  private cycleBarIndex = 0; // 0 .. grooveBarsCount (where cycleBarIndex === grooveBarsCount is the Chop bar)
  private chordBarIndex = 0;
  private nextNoteTime = 0;

  private visualQueue: Array<{
    time: number;
    stepIndex: number;
    barCount: number;
    isBeatStart: boolean;
    phase: PlayPhase;
    phaseBarIndex: number;
    phaseTotalBars: number;
    barCompleted?: { barCount: number; phase: PlayPhase; newBpm?: number };
  }> = [];

  private callbacks: EngineCallbacks | null = null;

  public setCallbacks(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Subtle bus compressor glues drums + piano + synth bass without clipping
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      compressor.knee.setValueAtTime(18, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(3.2, this.ctx.currentTime);
      compressor.attack.setValueAtTime(0.004, this.ctx.currentTime);
      compressor.release.setValueAtTime(0.14, this.ctx.currentTime);

      this.masterGain.connect(compressor);
      compressor.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer(this.ctx);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public updateSettings(opts: {
    pattern?: ChopPattern;
    practiceMode?: PracticeMode;
    backingInstrument?: BackingInstrument;
    grooveBarsCount?: number;
    bpm?: number;
    speedMultiplier?: SpeedMultiplier;
    loop?: boolean;
    metronomeEnabled?: boolean;
    soloClick?: boolean;
    muteClick?: boolean;
    silentKitMode?: boolean;
    volume?: number;
    ramp?: RampConfig;
  }) {
    if (opts.pattern !== undefined) {
      const changedPattern = this.pattern?.id !== opts.pattern.id;
      this.pattern = opts.pattern;
      this.baseGroovePattern = buildBaseGrooveForChop(opts.pattern);
      if (changedPattern) {
        this.currentStep = 0;
        this.cycleBarIndex = 0;
      }
    }
    if (opts.practiceMode !== undefined) {
      if (this.practiceMode !== opts.practiceMode) {
        this.practiceMode = opts.practiceMode;
        this.currentStep = 0;
        this.cycleBarIndex = 0;
      }
    }
    if (opts.backingInstrument !== undefined) {
      this.backingInstrument = opts.backingInstrument;
    }
    if (opts.grooveBarsCount !== undefined) {
      this.grooveBarsCount = Math.max(1, Math.min(3, opts.grooveBarsCount));
      if (this.cycleBarIndex > this.grooveBarsCount) {
        this.cycleBarIndex = 0;
      }
    }
    if (opts.bpm !== undefined) {
      this.bpm = Math.max(40, Math.min(220, opts.bpm));
    }
    if (opts.speedMultiplier !== undefined) {
      this.speedMultiplier = opts.speedMultiplier;
    }
    if (opts.loop !== undefined) this.loop = opts.loop;
    if (opts.metronomeEnabled !== undefined)
      this.metronomeEnabled = opts.metronomeEnabled;
    if (opts.soloClick !== undefined) this.soloClick = opts.soloClick;
    if (opts.muteClick !== undefined) this.muteClick = opts.muteClick;
    if (opts.silentKitMode !== undefined)
      this.silentKitMode = opts.silentKitMode;
    if (opts.volume !== undefined) {
      this.volume = Math.max(0, Math.min(1, opts.volume));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(
          this.volume,
          this.ctx.currentTime,
          0.015
        );
      }
    }
    if (opts.ramp !== undefined) this.ramp = { ...opts.ramp };
  }

  public start(pattern: ChopPattern) {
    this.pattern = pattern;
    this.baseGroovePattern = buildBaseGrooveForChop(pattern);
    const ctx = this.ensureContext();
    this.isPlaying = true;
    this.currentStep = 0;
    this.barCount = 1;
    this.cycleBarIndex = 0;
    this.chordBarIndex = 0;
    this.visualQueue = [];
    this.nextNoteTime = ctx.currentTime + 0.05;

    if (this.timerId !== null) window.clearInterval(this.timerId);
    this.timerId = window.setInterval(() => this.scheduler(), 25);

    if (this.rafId !== null) window.cancelAnimationFrame(this.rafId);
    const draw = () => {
      if (!this.isPlaying) return;
      this.flushVisualQueue();
      this.rafId = window.requestAnimationFrame(draw);
    };
    this.rafId = window.requestAnimationFrame(draw);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.visualQueue = [];
    this.callbacks?.onStop();
  }

  public auditionStep(step: ChopStep) {
    const ctx = this.ensureContext();
    if (step.voice === 'rest' || step.dynamic === 'rest') return;
    this.triggerDrumVoice(step.voice, step.dynamic, ctx.currentTime + 0.005);
  }

  public auditionVoice(voice: DrumVoice, dynamic: DynamicLevel = 'normal') {
    if (voice === 'rest' || dynamic === 'rest') return;
    const ctx = this.ensureContext();
    this.triggerDrumVoice(voice, dynamic, ctx.currentTime + 0.005);
  }

  private getStepDurationSeconds(): number {
    if (!this.pattern) return 0.125;
    const effectiveBpm = this.bpm * this.speedMultiplier;
    const secondsPerBeat = 60 / effectiveBpm;
    return secondsPerBeat / this.pattern.stepsPerBeat;
  }

  private scheduler() {
    if (!this.ctx || !this.pattern || !this.isPlaying) return;
    const scheduleAheadTime = 0.11;

    while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
      const isRealExample = this.practiceMode === 'real-example';
      const currentPhase: PlayPhase =
        isRealExample && this.cycleBarIndex < this.grooveBarsCount
          ? 'groove'
          : 'chop';

      const activePattern =
        currentPhase === 'groove' && this.baseGroovePattern
          ? this.baseGroovePattern
          : this.pattern;

      const totalSteps = activePattern.steps.length;
      const stepIndex = this.currentStep;
      const step = activePattern.steps[stepIndex];
      const spb = activePattern.stepsPerBeat;
      const isBeatStart = stepIndex % spb === 0;
      const isDownbeat = stepIndex === 0;

      // 1. Trigger drum voice (or beat-1 crash resolution when returning from chop to groove)
      if (!this.silentKitMode && !this.soloClick) {
        if (
          isRealExample &&
          currentPhase === 'groove' &&
          this.cycleBarIndex === 0 &&
          this.barCount > 1 &&
          isDownbeat
        ) {
          // Crisp crash + kick resolution back onto beat 1 of the groove
          this.triggerDrumVoice('crash', 'accent', this.nextNoteTime);
          this.triggerDrumVoice('kick', 'accent', this.nextNoteTime);
        } else if (step && step.voice !== 'rest' && step.dynamic !== 'rest') {
          this.triggerDrumVoice(step.voice, step.dynamic, this.nextNoteTime);
        }
      }

      // 2. Trigger metronome click
      const clickAllowed =
        (this.metronomeEnabled || this.soloClick) && !this.muteClick;
      if (clickAllowed && isBeatStart) {
        this.triggerClick(isDownbeat, this.nextNoteTime);
      }

      // 3. Trigger Electric Piano / Electronic Synth backing in Real Example mode
      const stepDuration = this.getStepDurationSeconds();
      if (
        isRealExample &&
        this.backingInstrument !== 'off' &&
        !this.soloClick
      ) {
        this.scheduleMusicalBacking(
          stepIndex,
          totalSteps,
          spb,
          this.chordBarIndex,
          this.nextNoteTime,
          stepDuration,
          currentPhase
        );
      }

      const scheduledTime = this.nextNoteTime;
      const scheduledBar = this.barCount;
      const phaseBarIndex =
        currentPhase === 'groove' ? this.cycleBarIndex + 1 : 1;
      const phaseTotalBars =
        currentPhase === 'groove' ? this.grooveBarsCount : 1;

      this.nextNoteTime += stepDuration;

      let barCompletedInfo:
        | { barCount: number; phase: PlayPhase; newBpm?: number }
        | undefined;

      if (stepIndex + 1 >= totalSteps) {
        const finishedRealCycle =
          !isRealExample || this.cycleBarIndex >= this.grooveBarsCount;

        if (!this.loop && finishedRealCycle) {
          this.visualQueue.push({
            time: scheduledTime,
            stepIndex,
            barCount: scheduledBar,
            isBeatStart,
            phase: currentPhase,
            phaseBarIndex,
            phaseTotalBars,
          });
          const stopDelay = Math.max(
            40,
            (this.nextNoteTime - this.ctx.currentTime) * 1000
          );
          this.isPlaying = false;
          if (this.timerId !== null) {
            window.clearInterval(this.timerId);
            this.timerId = null;
          }
          window.setTimeout(() => this.stop(), stopDelay);
          break;
        }

        this.currentStep = 0;
        const completedBars = this.barCount;
        this.barCount += 1;
        this.chordBarIndex = (this.chordBarIndex + 1) % PIANO_CHORDS_MIDI.length;

        if (isRealExample) {
          this.cycleBarIndex =
            this.cycleBarIndex >= this.grooveBarsCount
              ? 0
              : this.cycleBarIndex + 1;
        } else {
          this.cycleBarIndex = 0;
        }

        let newBpm: number | undefined;
        if (
          !isRealExample &&
          this.ramp.enabled &&
          completedBars % Math.max(1, this.ramp.everyBars) === 0
        ) {
          const target = Math.max(40, Math.min(220, this.ramp.targetBpm));
          const stepDelta = Math.max(1, Math.abs(this.ramp.stepBpm));
          if (this.bpm < target) {
            this.bpm = Math.min(target, this.bpm + stepDelta);
            newBpm = this.bpm;
          } else if (this.bpm > target) {
            this.bpm = Math.max(target, this.bpm - stepDelta);
            newBpm = this.bpm;
          }
        }
        barCompletedInfo = {
          barCount: completedBars,
          phase: currentPhase,
          newBpm,
        };
      } else {
        this.currentStep += 1;
      }

      this.visualQueue.push({
        time: scheduledTime,
        stepIndex,
        barCount: scheduledBar,
        isBeatStart,
        phase: currentPhase,
        phaseBarIndex,
        phaseTotalBars,
        barCompleted: barCompletedInfo,
      });
    }
  }

  private scheduleMusicalBacking(
    stepIndex: number,
    totalSteps: number,
    spb: number,
    chordBarIdx: number,
    time: number,
    stepDuration: number,
    phase: PlayPhase
  ) {
    const chord = PIANO_CHORDS_MIDI[chordBarIdx % PIANO_CHORDS_MIDI.length];
    const nextChord =
      PIANO_CHORDS_MIDI[(chordBarIdx + 1) % PIANO_CHORDS_MIDI.length];
    const rootMidi = BASS_ROOTS_MIDI[chordBarIdx % BASS_ROOTS_MIDI.length];
    const fifthMidi = BASS_FIFTHS_MIDI[chordBarIdx % BASS_FIFTHS_MIDI.length];

    const beatDuration = stepDuration * spb;
    const isBeatStart = stepIndex % spb === 0;
    const beatIndex = Math.floor(stepIndex / spb);
    const sub = stepIndex % spb;
    const halfBeat = Math.max(1, Math.floor(spb / 2));
    // For compound/triplet subdivisions (3, 6, or 9 per beat), anticipate on the last triplet skip
    const compSub =
      spb === 3 ? 2 : spb === 6 ? 4 : spb === 9 ? 6 : halfBeat;
    const totalBeats = Math.max(2, Math.round(totalSteps / spb));
    const isLastGrooveBar =
      phase === 'groove' && this.cycleBarIndex === this.grooveBarsCount - 1;

    const playAcousticPiano =
      this.backingInstrument === 'acoustic-piano' ||
      this.backingInstrument === 'both';
    const playRhodes =
      this.backingInstrument === 'piano' || this.backingInstrument === 'both';
    const playElectronic =
      this.backingInstrument === 'electronic' ||
      this.backingInstrument === 'both';

    // 1. Acoustic Stage Piano Comping (Left-hand bass + rhythmic right-hand voicings)
    if (playAcousticPiano) {
      const pianoGainScale = this.backingInstrument === 'acoustic-piano' ? 1.0 : 0.72;

      if (stepIndex === 0) {
        // Beat 1: Deep left-hand piano bass + full right-hand chord voicing
        this.synthPianoBassNote(m2f(rootMidi), time, beatDuration * 1.6, 0.44 * pianoGainScale);
        this.synthAcousticPianoChord(chord, time, beatDuration * 1.45, 0.48 * pianoGainScale);
      } else if (phase === 'groove') {
        if (beatIndex === 1 && sub === compSub && spb >= 2) {
          // "& of 2" (or triplet skip): Classic syncopated comping stab
          this.synthAcousticPianoChord(chord.slice(1), time, beatDuration * 0.55, 0.36 * pianoGainScale);
        } else if (beatIndex === 2 && sub === 0 && totalBeats >= 3) {
          // Beat 3: Left-hand fifth/octave support + warm upper chord touch
          this.synthPianoBassNote(m2f(fifthMidi), time, beatDuration * 0.8, 0.32 * pianoGainScale);
          if (totalBeats >= 4) {
            this.synthAcousticPianoChord(chord.slice(2), time, beatDuration * 0.65, 0.28 * pianoGainScale);
          }
        } else if (beatIndex === 3 && sub === 0 && totalBeats >= 6) {
          // Beat 4 in 6/4: Secondary harmonic push into second half of the 6-beat bar
          this.synthPianoBassNote(m2f(rootMidi), time, beatDuration * 1.1, 0.36 * pianoGainScale);
          this.synthAcousticPianoChord(nextChord.slice(1), time, beatDuration * 0.9, 0.36 * pianoGainScale);
        } else if (beatIndex === 4 && sub === compSub && totalBeats >= 6 && spb >= 2) {
          // "& of 5" in 6/4
          this.synthAcousticPianoChord(nextChord.slice(1), time, beatDuration * 0.5, 0.32 * pianoGainScale);
        } else if (
          isLastGrooveBar &&
          beatIndex === totalBeats - 1 &&
          sub === compSub &&
          spb >= 2
        ) {
          // "& of last beat" turnaround pickup right into the Chop Fill!
          this.synthAcousticPianoChord(
            nextChord.slice(1),
            time,
            beatDuration * 0.45,
            0.38 * pianoGainScale
          );
        } else if (
          !isLastGrooveBar &&
          totalBeats >= 4 &&
          beatIndex === totalBeats - 1 &&
          sub === 0
        ) {
          // Light final-beat ghost comp chord keeping pocket momentum
          this.synthAcousticPianoChord(chord.slice(2), time, beatDuration * 0.4, 0.24 * pianoGainScale);
        }
      } else if (phase === 'chop') {
        // Band "hits" behind the drummer's chop so the fill breathes musically
        if (beatIndex === 2 && sub === 0 && totalSteps >= spb * 3) {
          this.synthPianoBassNote(m2f(rootMidi + 12), time, beatDuration * 0.75, 0.34 * pianoGainScale);
          this.synthAcousticPianoChord(chord.slice(1), time, beatDuration * 0.85, 0.36 * pianoGainScale);
        } else if (beatIndex === 4 && sub === 0 && totalBeats >= 6) {
          this.synthAcousticPianoChord(nextChord.slice(1), time, beatDuration * 0.75, 0.3 * pianoGainScale);
        }
      }
    }

    // 2. Rhodes Electric Piano Layer (Warm neo-soul sustain)
    if (playRhodes) {
      const rhodesScale = this.backingInstrument === 'piano' ? 1.0 : 0.62;
      if (stepIndex === 0) {
        this.synthRhodesChord(chord, time, beatDuration * 1.9, 0.46 * rhodesScale);
      } else if (
        phase === 'groove' &&
        beatIndex === 1 &&
        sub === compSub &&
        spb >= 2
      ) {
        this.synthRhodesChord(chord.slice(1), time, beatDuration * 1.0, 0.34 * rhodesScale);
      } else if (
        phase === 'groove' &&
        totalBeats >= 6 &&
        beatIndex === 3 &&
        sub === 0
      ) {
        this.synthRhodesChord(nextChord, time, beatDuration * 1.4, 0.38 * rhodesScale);
      } else if (
        phase === 'groove' &&
        totalBeats >= 4 &&
        beatIndex === totalBeats - 1 &&
        sub === compSub &&
        spb >= 2
      ) {
        this.synthRhodesChord(nextChord.slice(1), time, beatDuration * 0.55, 0.28 * rhodesScale);
      } else if (
        phase === 'chop' &&
        beatIndex === 2 &&
        sub === 0 &&
        totalSteps >= spb * 3
      ) {
        this.synthRhodesChord(chord, time, beatDuration * 1.4, 0.32 * rhodesScale);
      }
    }

    // 3. Electronic Synth (Filtered Bassline + Tight Pluck Arp)
    if (playElectronic) {
      if (stepIndex === 0) {
        this.synthBassNote(m2f(rootMidi), time, beatDuration * 0.9, 0.34);
      } else if (isBeatStart && (beatIndex === 2 || (totalBeats >= 6 && beatIndex === 4))) {
        this.synthBassNote(m2f(rootMidi), time, beatDuration * 0.8, 0.28);
      } else if (
        phase === 'groove' &&
        beatIndex === 1 &&
        sub === compSub &&
        spb >= 2
      ) {
        this.synthBassNote(m2f(fifthMidi), time, beatDuration * 0.45, 0.22);
      } else if (stepIndex === totalSteps - Math.max(1, halfBeat)) {
        // Leading bass pickup into next bar
        this.synthBassNote(m2f(fifthMidi), time, stepDuration * 1.5, 0.2);
      }

      // Electronic pluck pulse when Electronic mode is active
      if (
        this.backingInstrument === 'electronic' &&
        isBeatStart &&
        phase === 'groove'
      ) {
        const arpNote = chord[beatIndex % chord.length] + 12;
        this.synthElectronicPluck(
          m2f(arpNote),
          time,
          beatDuration * 0.45,
          0.16
        );
      }
    }
  }

  private synthPianoBassNote(
    freq: number,
    time: number,
    duration: number,
    gainLevel: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const fundamental = this.ctx.createOscillator();
    fundamental.type = 'triangle';
    fundamental.frequency.setValueAtTime(freq, time);

    const harmonic2 = this.ctx.createOscillator();
    harmonic2.type = 'sawtooth';
    harmonic2.frequency.setValueAtTime(freq * 2, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(340, time + Math.min(0.6, duration));
    filter.Q.setValueAtTime(0.9, time);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.001, time);
    env.gain.linearRampToValueAtTime(gainLevel, time + 0.006);
    env.gain.exponentialRampToValueAtTime(
      0.001,
      time + Math.max(0.25, duration)
    );

    const h2Gain = this.ctx.createGain();
    h2Gain.gain.setValueAtTime(0.26, time);

    fundamental.connect(filter);
    harmonic2.connect(h2Gain);
    h2Gain.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    fundamental.start(time);
    harmonic2.start(time);
    fundamental.stop(time + duration + 0.06);
    harmonic2.stop(time + duration + 0.06);
  }

  private synthAcousticPianoChord(
    midiNotes: number[],
    time: number,
    duration: number,
    gainLevel: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const perNoteGain = gainLevel / Math.max(1.8, Math.sqrt(midiNotes.length));

    // Shared bright-to-warm acoustic soundboard filter per chord
    const boardFilter = this.ctx.createBiquadFilter();
    boardFilter.type = 'lowpass';
    boardFilter.frequency.setValueAtTime(4800, time);
    boardFilter.frequency.exponentialRampToValueAtTime(
      900,
      time + Math.min(0.45, Math.max(0.15, duration * 0.7))
    );
    boardFilter.Q.setValueAtTime(0.7, time);
    boardFilter.connect(this.masterGain);

    // Subtle felt hammer transient click
    if (this.noiseBuffer) {
      const hammer = this.ctx.createBufferSource();
      hammer.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2400, time);
      bp.Q.setValueAtTime(1.4, time);
      const hGain = this.ctx.createGain();
      hGain.gain.setValueAtTime(gainLevel * 0.14, time);
      hGain.gain.exponentialRampToValueAtTime(0.0005, time + 0.014);
      hammer.connect(bp);
      bp.connect(hGain);
      hGain.connect(this.masterGain);
      hammer.start(time);
      hammer.stop(time + 0.018);
    }

    midiNotes.forEach((midi, idx) => {
      if (!this.ctx) return;
      const freq = m2f(midi);
      const strumOffset = idx * 0.004;

      // Primary string pair (slightly detuned for realistic piano unison strings)
      const oscA = this.ctx.createOscillator();
      oscA.type = 'triangle';
      oscA.frequency.setValueAtTime(freq, time + strumOffset);

      const oscB = this.ctx.createOscillator();
      oscB.type = 'sawtooth';
      oscB.frequency.setValueAtTime(freq * 1.0018, time + strumOffset);

      const bGain = this.ctx.createGain();
      bGain.gain.setValueAtTime(0.32, time + strumOffset);

      const env = this.ctx.createGain();
      env.gain.setValueAtTime(0.001, time + strumOffset);
      env.gain.linearRampToValueAtTime(perNoteGain, time + strumOffset + 0.005);
      // Fast hammer-drop into sustained string tail
      env.gain.exponentialRampToValueAtTime(
        perNoteGain * 0.45,
        time + strumOffset + 0.09
      );
      env.gain.exponentialRampToValueAtTime(
        0.001,
        time + strumOffset + Math.max(0.22, duration)
      );

      oscA.connect(env);
      oscB.connect(bGain);
      bGain.connect(env);
      env.connect(boardFilter);

      oscA.start(time + strumOffset);
      oscB.start(time + strumOffset);
      oscA.stop(time + strumOffset + duration + 0.08);
      oscB.stop(time + strumOffset + duration + 0.08);
    });
  }

  private synthRhodesChord(
    midiNotes: number[],
    time: number,
    duration: number,
    gainLevel: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const perNoteGain = gainLevel / Math.max(1.8, Math.sqrt(midiNotes.length));

    midiNotes.forEach((midi, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const freq = m2f(midi);
      const strumOffset = idx * 0.007;

      // Warm sine body + subtle detuned chorus twin
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + strumOffset);

      const chorus = this.ctx.createOscillator();
      chorus.type = 'sine';
      chorus.frequency.setValueAtTime(freq * 1.0025, time + strumOffset);

      // Gentle bell tine overtone
      const tine = this.ctx.createOscillator();
      tine.type = 'triangle';
      tine.frequency.setValueAtTime(freq * 2, time + strumOffset);

      const tineGain = this.ctx.createGain();
      tineGain.gain.setValueAtTime(perNoteGain * 0.34, time + strumOffset);
      tineGain.gain.exponentialRampToValueAtTime(0.0005, time + strumOffset + 0.14);

      const env = this.ctx.createGain();
      env.gain.setValueAtTime(0.001, time + strumOffset);
      env.gain.linearRampToValueAtTime(perNoteGain, time + strumOffset + 0.012);
      env.gain.exponentialRampToValueAtTime(
        0.001,
        time + strumOffset + Math.max(0.22, duration)
      );

      const chorusGain = this.ctx.createGain();
      chorusGain.gain.setValueAtTime(0.55, time + strumOffset);

      osc.connect(env);
      chorus.connect(chorusGain);
      chorusGain.connect(env);
      tine.connect(tineGain);
      tineGain.connect(this.masterGain);
      env.connect(this.masterGain);

      osc.start(time + strumOffset);
      chorus.start(time + strumOffset);
      tine.start(time + strumOffset);
      osc.stop(time + strumOffset + duration + 0.06);
      chorus.stop(time + strumOffset + duration + 0.06);
      tine.stop(time + strumOffset + 0.18);
    });
  }

  private synthBassNote(
    freq: number,
    time: number,
    duration: number,
    gainLevel: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, time);
    filter.frequency.exponentialRampToValueAtTime(160, time + duration);
    filter.Q.setValueAtTime(2.5, time);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.001, time);
    env.gain.linearRampToValueAtTime(gainLevel, time + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, time + Math.max(0.08, duration));

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(time);
    sub.start(time);
    osc.stop(time + duration + 0.03);
    sub.stop(time + duration + 0.03);
  }

  private synthElectronicPluck(
    freq: number,
    time: number,
    duration: number,
    gainLevel: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(420, time + duration);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.001, time);
    env.gain.linearRampToValueAtTime(gainLevel, time + 0.008);
    env.gain.exponentialRampToValueAtTime(0.001, time + Math.max(0.06, duration));

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.03);
  }

  private flushVisualQueue() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    while (this.visualQueue.length > 0 && this.visualQueue[0].time <= now + 0.01) {
      const event = this.visualQueue.shift()!;
      this.callbacks?.onStep(
        event.stepIndex,
        event.barCount,
        event.isBeatStart,
        event.phase,
        event.phaseBarIndex,
        event.phaseTotalBars
      );
      if (event.barCompleted) {
        this.callbacks?.onBarComplete(
          event.barCompleted.barCount,
          event.barCompleted.phase,
          event.barCompleted.newBpm
        );
      }
    }
  }

  private getDynamicGain(dynamic: DynamicLevel): number {
    switch (dynamic) {
      case 'accent':
        return 1.25;
      case 'ghost':
        return 0.24;
      case 'normal':
        return 0.78;
      default:
        return 0;
    }
  }

  private triggerClick(isDownbeat: boolean, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isDownbeat ? 1320 : 880, time);
    gain.gain.setValueAtTime(isDownbeat ? 0.35 : 0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.04);
  }

  private triggerDrumVoice(
    voice: DrumVoice,
    dynamic: DynamicLevel,
    time: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const vel = this.getDynamicGain(dynamic);
    if (vel <= 0) return;

    switch (voice) {
      case 'kick':
        this.synthKick(time, vel);
        break;
      case 'snare':
        this.synthSnare(time, vel, dynamic === 'accent');
        break;
      case 'tom1':
        this.synthTom(time, vel, 235, 148);
        break;
      case 'tom2':
        this.synthTom(time, vel, 172, 108);
        break;
      case 'floor':
        this.synthTom(time, vel, 114, 65);
        break;
      case 'hihat':
        this.synthHiHat(time, vel);
        break;
      case 'crash':
        this.synthCrash(time, vel);
        break;
      default:
        break;
    }
  }

  private synthKick(time: number, vel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(155, time);
    osc.frequency.exponentialRampToValueAtTime(46, time + 0.11);
    gain.gain.setValueAtTime(0.95 * vel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.3);

    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1800, time);
    clickOsc.frequency.exponentialRampToValueAtTime(280, time + 0.018);
    clickGain.gain.setValueAtTime(0.32 * vel, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.022);
    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(time);
    clickOsc.stop(time + 0.025);
  }

  private synthSnare(time: number, vel: number, isAccent: boolean) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isAccent ? 205 : 185, time);
    osc.frequency.exponentialRampToValueAtTime(125, time + 0.075);
    oscGain.gain.setValueAtTime(0.5 * vel, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.13);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isAccent ? 2800 : 2200, time);
    filter.Q.setValueAtTime(0.85, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.68 * vel, time);
    noiseGain.gain.exponentialRampToValueAtTime(
      0.001,
      time + (isAccent ? 0.18 : 0.12)
    );

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.2);
  }

  private synthTom(
    time: number,
    vel: number,
    startFreq: number,
    endFreq: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.16);
    gain.gain.setValueAtTime(0.75 * vel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.26);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.28);

    const attack = this.ctx.createOscillator();
    const attackGain = this.ctx.createGain();
    attack.type = 'triangle';
    attack.frequency.setValueAtTime(startFreq * 2.2, time);
    attack.frequency.exponentialRampToValueAtTime(startFreq, time + 0.025);
    attackGain.gain.setValueAtTime(0.28 * vel, time);
    attackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    attack.connect(attackGain);
    attackGain.connect(this.masterGain);
    attack.start(time);
    attack.stop(time + 0.035);
  }

  private synthHiHat(time: number, vel: number) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(7200, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.32 * vel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);

    noise.connect(hp);
    hp.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.065);
  }

  private synthCrash(time: number, vel: number) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(4200, time);

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(6400, time);
    bp.Q.setValueAtTime(0.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45 * vel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.52);

    noise.connect(hp);
    hp.connect(bp);
    bp.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.55);

    const freqs = [310, 445, 580];
    freqs.forEach((f) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const oGain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, time);
      oGain.gain.setValueAtTime(0.04 * vel, time);
      oGain.gain.exponentialRampToValueAtTime(0.0005, time + 0.3);
      osc.connect(oGain);
      oGain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.32);
    });
  }
}
