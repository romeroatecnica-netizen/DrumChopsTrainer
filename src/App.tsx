import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Globe, User } from 'lucide-react';
import { DrumAudioEngine } from './audio/drumEngine';
import { ChopLibrarySection } from './components/ChopLibrarySection';
import { CustomChopEditorModal } from './components/CustomChopEditorModal';
import { DrumKitMotionStage } from './components/DrumKitMotionStage';
import { MonetizationAndSeoGuide } from './components/MonetizationAndSeoGuide';
import { ProfileBackupModal } from './components/ProfileBackupModal';
import { RhythmGridSequencer } from './components/RhythmGridSequencer';
import { TransportControls } from './components/TransportControls';
import {
  CANONICAL_ORIGIN,
  LANG_META,
  SUPPORTED_LANGS,
  type SupportedLang,
} from './config/site';
import { CHOPS_LIBRARY } from './data/chopsLibrary';
import { buildBaseGrooveForChop } from './data/grooveGenerator';
import { TRANSLATIONS } from './i18n/translations';
import {
  detectInitialLanguage,
  persistLanguageSelection,
  syncSeoHead,
} from './seo/seoManager';
import {
  createDefaultProfile,
  deleteCustomChop,
  exportProfileStoreJson,
  loadProfileStore,
  parseImportedProfileStore,
  recordChopPractice,
  saveProfileStore,
  toggleMasteredChop,
  updateStreakAndSeconds,
  upsertCustomChop,
} from './storage/profileStorage';
import type {
  BackingInstrument,
  ChopPattern,
  ChopStep,
  DrumVoice,
  DynamicLevel,
  PlayPhase,
  PracticeMode,
  ProfileStore,
  RampConfig,
  SpeedMultiplier,
} from './types/drum';

export default function App() {
  // Language & SEO
  const [lang, setLang] = useState<SupportedLang>(() => detectInitialLanguage());
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    syncSeoHead(lang, t);
  }, [lang, t]);

  const handleLanguageChange = (nextLang: SupportedLang) => {
    setLang(nextLang);
    persistLanguageSelection(nextLang);
  };

  // Profile & Local Storage
  const [profileStore, setProfileStore] = useState<ProfileStore>(() =>
    loadProfileStore()
  );

  useEffect(() => {
    saveProfileStore(profileStore);
  }, [profileStore]);

  const activeProfile = useMemo(
    () =>
      profileStore.profiles.find(
        (p) => p.id === profileStore.activeProfileId
      ) ?? profileStore.profiles[0],
    [profileStore]
  );

  // Selected Pattern & Studio State
  const [selectedChop, setSelectedChop] = useState<ChopPattern>(
    () => CHOPS_LIBRARY[0]
  );
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('trainer');
  const [backingInstrument, setBackingInstrument] =
    useState<BackingInstrument>('both');
  const [grooveBarsCount, setGrooveBarsCount] = useState<number>(2);
  const [playPhase, setPlayPhase] = useState<PlayPhase>('chop');
  const [phaseBarIndex, setPhaseBarIndex] = useState<number>(1);
  const [phaseTotalBars, setPhaseTotalBars] = useState<number>(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState<number>(CHOPS_LIBRARY[0].defaultBpm);
  const [trainerBpmSaved, setTrainerBpmSaved] = useState<number>(
    CHOPS_LIBRARY[0].defaultBpm
  );
  const [speedMultiplier, setSpeedMultiplier] = useState<SpeedMultiplier>(1);
  const [loop, setLoop] = useState(true);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);
  const [soloClick, setSoloClick] = useState(false);
  const [muteClick, setMuteClick] = useState(false);
  const [silentKitMode, setSilentKitMode] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [viewMode, setViewMode] = useState<'both' | 'kit' | 'grid'>('both');

  const [ramp, setRamp] = useState<RampConfig>({
    enabled: false,
    stepBpm: 4,
    everyBars: 4,
    targetBpm: CHOPS_LIBRARY[0].targetBpm,
  });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [inspectedStepIndex, setInspectedStepIndex] = useState(0);
  const [currentBar, setCurrentBar] = useState(1);

  // Modals
  const [editorState, setEditorState] = useState<{
    open: boolean;
    initial: ChopPattern | null;
  }>({ open: false, initial: null });
  const [profilesModalOpen, setProfilesModalOpen] = useState(false);

  // Matching Base Groove for Real Musical Example Mode
  const baseGroovePattern = useMemo(
    () => buildBaseGrooveForChop(selectedChop),
    [selectedChop]
  );

  // Web Audio Engine Instance
  const engineRef = useRef<DrumAudioEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new DrumAudioEngine();
  }

  // Keep engine settings synchronized
  useEffect(() => {
    engineRef.current?.updateSettings({
      pattern: selectedChop,
      practiceMode,
      backingInstrument,
      grooveBarsCount,
      bpm,
      speedMultiplier,
      loop,
      metronomeEnabled,
      soloClick,
      muteClick,
      silentKitMode,
      volume,
      ramp,
    });
  }, [
    selectedChop,
    practiceMode,
    backingInstrument,
    grooveBarsCount,
    bpm,
    speedMultiplier,
    loop,
    metronomeEnabled,
    soloClick,
    muteClick,
    silentKitMode,
    volume,
    ramp,
  ]);

  // Wire engine playback callbacks
  const effectiveBpm = Math.round(bpm * speedMultiplier);
  const effectiveBpmRef = useRef(effectiveBpm);
  effectiveBpmRef.current = effectiveBpm;

  const selectedChopIdRef = useRef(selectedChop.id);
  selectedChopIdRef.current = selectedChop.id;

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setCallbacks({
      onStep: (stepIdx, barNum, _isBeatStart, phase, pBarIdx, pTotalBars) => {
        setActiveStepIndex(stepIdx);
        setCurrentBar(barNum);
        setPlayPhase(phase);
        setPhaseBarIndex(pBarIdx);
        setPhaseTotalBars(pTotalBars);
      },
      onBarComplete: (_barCount, phase, updatedBpm) => {
        if (updatedBpm !== undefined) {
          setBpm(updatedBpm);
        }
        if (phase === 'chop') {
          setProfileStore((prev) => ({
            ...prev,
            profiles: prev.profiles.map((p) =>
              p.id === prev.activeProfileId
                ? recordChopPractice(
                    p,
                    selectedChopIdRef.current,
                    effectiveBpmRef.current
                  )
                : p
            ),
          }));
        }
      },
      onStop: () => {
        setIsPlaying(false);
      },
    });

    return () => {
      engine.stop();
    };
  }, []);

  // Practice time & streak accumulator while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setProfileStore((prev) => ({
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId ? updateStreakAndSeconds(p, 1) : p
        ),
      }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const handlePracticeModeChange = (nextMode: PracticeMode) => {
    if (nextMode === practiceMode) return;
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      engineRef.current?.stop();
      setIsPlaying(false);
    }

    setPracticeMode(nextMode);
    setActiveStepIndex(0);
    setInspectedStepIndex(0);
    setCurrentBar(1);

    if (nextMode === 'real-example') {
      // Save trainer BPM and switch automatically to Real Musical Speed (targetBpm) at 1.0x
      setTrainerBpmSaved(bpm);
      setBpm(selectedChop.targetBpm);
      setSpeedMultiplier(1);
      setPlayPhase('groove');
      setPhaseBarIndex(1);
      setPhaseTotalBars(grooveBarsCount);
    } else {
      setBpm(trainerBpmSaved || selectedChop.defaultBpm);
      setPlayPhase('chop');
      setPhaseBarIndex(1);
      setPhaseTotalBars(1);
    }
  };

  const handleTogglePlay = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (isPlaying) {
      engine.stop();
      setIsPlaying(false);
    } else {
      setProfileStore((prev) => ({
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId
            ? recordChopPractice(p, selectedChop.id, effectiveBpm)
            : p
        ),
      }));
      if (practiceMode === 'real-example') {
        setPlayPhase('groove');
        setPhaseBarIndex(1);
        setPhaseTotalBars(grooveBarsCount);
      } else {
        setPlayPhase('chop');
      }
      engine.start(selectedChop);
      setIsPlaying(true);
    }
  }, [
    isPlaying,
    selectedChop,
    effectiveBpm,
    practiceMode,
    grooveBarsCount,
  ]);

  // Spacebar shortcut for Play / Stop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      if (editorState.open || profilesModalOpen) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      handleTogglePlay();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleTogglePlay, editorState.open, profilesModalOpen]);

  const handleSelectChop = (chop: ChopPattern) => {
    if (isPlaying) {
      engineRef.current?.stop();
      setIsPlaying(false);
    }
    setSelectedChop(chop);
    setTrainerBpmSaved(chop.defaultBpm);
    if (practiceMode === 'real-example') {
      setBpm(chop.targetBpm);
      setSpeedMultiplier(1);
      setPlayPhase('groove');
      setPhaseBarIndex(1);
      setPhaseTotalBars(grooveBarsCount);
    } else {
      setBpm(chop.defaultBpm);
      setPlayPhase('chop');
    }
    setRamp((prev) => ({ ...prev, targetBpm: chop.targetBpm }));
    setActiveStepIndex(0);
    setInspectedStepIndex(0);
    setCurrentBar(1);
    document.getElementById('trainer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBpmChange = (next: number) => {
    const clamped = Math.max(40, Math.min(220, next));
    setBpm(clamped);
    if (practiceMode === 'trainer') {
      setTrainerBpmSaved(clamped);
    }
  };

  const handleAuditionVoice = (
    voice: DrumVoice,
    dynamic: DynamicLevel = 'normal'
  ) => {
    engineRef.current?.auditionVoice(voice, dynamic);
  };

  // Active pattern displayed on stage (Groove during groove bars, Chop during chop bar/trainer mode)
  const displayedPattern: ChopPattern =
    practiceMode === 'real-example' && isPlaying && playPhase === 'groove'
      ? baseGroovePattern
      : selectedChop;

  const handleSelectGridStep = (index: number) => {
    setInspectedStepIndex(index);
    const step = displayedPattern.steps[index];
    if (step) {
      engineRef.current?.auditionStep(step);
    }
  };

  const handleToggleMastered = () => {
    setProfileStore((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === prev.activeProfileId
          ? toggleMasteredChop(p, selectedChop.id)
          : p
      ),
    }));
  };

  const handleSaveCustomChop = (pattern: ChopPattern) => {
    setProfileStore((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === prev.activeProfileId ? upsertCustomChop(p, pattern) : p
      ),
    }));
    setSelectedChop(pattern);
    setBpm(
      practiceMode === 'real-example' ? pattern.targetBpm : pattern.defaultBpm
    );
    setActiveStepIndex(0);
    setInspectedStepIndex(0);
    setEditorState({ open: false, initial: null });
  };

  const handleDeleteCustomChop = (chopId: string) => {
    setProfileStore((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === prev.activeProfileId ? deleteCustomChop(p, chopId) : p
      ),
    }));
    if (selectedChop.id === chopId) {
      setSelectedChop(CHOPS_LIBRARY[0]);
      setBpm(
        practiceMode === 'real-example'
          ? CHOPS_LIBRARY[0].targetBpm
          : CHOPS_LIBRARY[0].defaultBpm
      );
    }
  };

  const handleCreateProfile = (name: string) => {
    const nextProf = createDefaultProfile(name);
    setProfileStore((prev) => ({
      ...prev,
      activeProfileId: nextProf.id,
      profiles: [...prev.profiles, nextProf],
    }));
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfileStore((prev) => {
      if (prev.profiles.length <= 1) return prev;
      const remaining = prev.profiles.filter((p) => p.id !== profileId);
      const nextActive =
        prev.activeProfileId === profileId
          ? remaining[0].id
          : prev.activeProfileId;
      return {
        ...prev,
        activeProfileId: nextActive,
        profiles: remaining,
      };
    });
  };

  const handleExportJson = () => {
    const json = exportProfileStoreJson(profileStore);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drumchopcue-profiles-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (jsonText: string): boolean => {
    const parsed = parseImportedProfileStore(jsonText);
    if (!parsed) return false;
    setProfileStore(parsed);
    return true;
  };

  const currentDisplayStep: ChopStep | null = isPlaying
    ? displayedPattern.steps[activeStepIndex] ?? null
    : displayedPattern.steps[inspectedStepIndex] ??
      displayedPattern.steps[0] ??
      null;

  const isMastered = activeProfile.masteredChopIds.includes(selectedChop.id);
  const bestBpm = activeProfile.bestBpmByChop[selectedChop.id];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#trainer"
            className="font-display text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            drumchopcue
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#trainer"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.trainer}
            </a>
            <a
              href="#library"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.library}
            </a>
            <button
              type="button"
              onClick={() => setEditorState({ open: true, initial: null })}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.custom}
            </button>
            <a
              href="#guide"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.guide}
            </a>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setProfilesModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.nav.profilesBtn}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Hero & Studio Utility Strip */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-4 border-b border-slate-200/80">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              {t.hero.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <p className="text-xs text-slate-500">{t.hero.transparentNotice}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="text-xs text-slate-600 font-mono-tabular">
              <span>{activeProfile.name}</span>
              <span className="mx-1.5" aria-hidden="true">
                ·
              </span>
              <span className="text-emerald-700 font-semibold">
                {activeProfile.masteredChopIds.length}/{CHOPS_LIBRARY.length}{' '}
                {t.profile.masteredCountLabel}
              </span>
              <span className="mx-1.5" aria-hidden="true">
                ·
              </span>
              <span>
                {activeProfile.streakDays} {t.profile.daysUnit}
              </span>
            </div>

            <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={lang}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as SupportedLang)
                }
                aria-label="Language"
                className="bg-transparent focus:outline-none cursor-pointer font-medium text-slate-900"
              >
                {SUPPORTED_LANGS.map((code) => (
                  <option key={code} value={code}>
                    {LANG_META[code].nativeName} ({code.toUpperCase()})
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* Trainer Studio */}
        <section id="trainer" className="space-y-4">
          <TransportControls
            pattern={selectedChop}
            practiceMode={practiceMode}
            backingInstrument={backingInstrument}
            grooveBarsCount={grooveBarsCount}
            playPhase={playPhase}
            phaseBarIndex={phaseBarIndex}
            phaseTotalBars={phaseTotalBars}
            isPlaying={isPlaying}
            bpm={bpm}
            speedMultiplier={speedMultiplier}
            loop={loop}
            metronomeEnabled={metronomeEnabled}
            soloClick={soloClick}
            muteClick={muteClick}
            silentKitMode={silentKitMode}
            volume={volume}
            currentBar={currentBar}
            currentStepIndex={activeStepIndex}
            activeStepsTotal={displayedPattern.steps.length}
            ramp={ramp}
            isMastered={isMastered}
            bestBpm={bestBpm}
            viewMode={viewMode}
            onPracticeModeChange={handlePracticeModeChange}
            onBackingInstrumentChange={setBackingInstrument}
            onGrooveBarsChange={setGrooveBarsCount}
            onTogglePlay={handleTogglePlay}
            onBpmChange={handleBpmChange}
            onSpeedChange={setSpeedMultiplier}
            onToggleLoop={() => setLoop((v) => !v)}
            onToggleMetronome={() => setMetronomeEnabled((v) => !v)}
            onToggleSoloClick={() => setSoloClick((v) => !v)}
            onToggleMuteClick={() => setMuteClick((v) => !v)}
            onToggleSilentKit={() => setSilentKitMode((v) => !v)}
            onVolumeChange={setVolume}
            onRampChange={setRamp}
            onToggleMastered={handleToggleMastered}
            onDuplicateEdit={() =>
              setEditorState({ open: true, initial: selectedChop })
            }
            onViewModeChange={setViewMode}
            t={t}
          />

          {/* Synchronized Dual Stage (Kit SVG + Interactive Rhythm Grid) */}
          <div
            className={`grid gap-4 items-stretch ${
              viewMode === 'both' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
            }`}
          >
            {(viewMode === 'both' || viewMode === 'kit') && (
              <div className={viewMode === 'both' ? 'lg:col-span-5' : ''}>
                <DrumKitMotionStage
                  currentStep={currentDisplayStep}
                  isPlaying={isPlaying}
                  silentKitMode={silentKitMode}
                  onAuditionVoice={handleAuditionVoice}
                  t={t}
                />
              </div>
            )}

            {(viewMode === 'both' || viewMode === 'grid') && (
              <div className={viewMode === 'both' ? 'lg:col-span-7' : ''}>
                <RhythmGridSequencer
                  pattern={displayedPattern}
                  practiceMode={practiceMode}
                  playPhase={playPhase}
                  activeStepIndex={activeStepIndex}
                  inspectedStepIndex={inspectedStepIndex}
                  isPlaying={isPlaying}
                  onSelectStep={handleSelectGridStep}
                  t={t}
                />
              </div>
            )}
          </div>
        </section>

        {/* Progressive 6-Level Library */}
        <ChopLibrarySection
          libraryChops={CHOPS_LIBRARY}
          activeProfile={activeProfile}
          selectedChopId={selectedChop.id}
          onSelectChop={handleSelectChop}
          onCreateCustom={() => setEditorState({ open: true, initial: null })}
          onDeleteCustom={handleDeleteCustomChop}
          t={t}
        />

        {/* Media.net Ad Slots + Contextual Gear + Editorial SEO Guide + FAQ */}
        <MonetizationAndSeoGuide t={t} />
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">
              {t.footer.copyright}
            </span>
            <span aria-hidden="true">·</span>
            <a
              href={CANONICAL_ORIGIN}
              className="hover:text-slate-800 transition-colors"
            >
              drumchopcue.bastelar.com
            </a>
          </div>
          <p>{t.footer.localNotice}</p>
        </div>
      </footer>

      {/* Custom Chop Editor Modal */}
      {editorState.open && (
        <CustomChopEditorModal
          initialPattern={editorState.initial}
          onSave={handleSaveCustomChop}
          onAuditionStep={(step) => engineRef.current?.auditionStep(step)}
          onClose={() => setEditorState({ open: false, initial: null })}
          t={t}
        />
      )}

      {/* Local Profiles & JSON Backup Modal */}
      {profilesModalOpen && (
        <ProfileBackupModal
          store={profileStore}
          onSelectProfile={(id) =>
            setProfileStore((prev) => ({ ...prev, activeProfileId: id }))
          }
          onCreateProfile={handleCreateProfile}
          onDeleteProfile={handleDeleteProfile}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onClose={() => setProfilesModalOpen(false)}
          t={t}
        />
      )}
    </div>
  );
}
