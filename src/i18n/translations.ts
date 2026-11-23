import type { SupportedLang } from '../config/site';

export interface FaqItem {
  q: string;
  a: string;
}

export interface TranslationBundle {
  seo: {
    title: string;
    description: string;
    appDescription: string;
  };
  nav: {
    trainer: string;
    library: string;
    custom: string;
    guide: string;
    profilesBtn: string;
  };
  hero: {
    title: string;
    subtitle: string;
    transparentNotice: string;
  };
  controls: {
    play: string;
    stop: string;
    loop: string;
    metronome: string;
    soloClick: string;
    muteClick: string;
    silentKit: string;
    silentKitHint: string;
    volume: string;
    bpm: string;
    effectiveBpm: string;
    speed: string;
    bar: string;
    step: string;
    viewBoth: string;
    viewKit: string;
    viewGrid: string;
    rampTitle: string;
    rampEnable: string;
    rampStep: string;
    rampEvery: string;
    rampBarsUnit: string;
    rampTarget: string;
    rampNextIn: string;
    markMastered: string;
    mastered: string;
    bestBpm: string;
    duplicateEdit: string;
    createCustom: string;
  };
  stage: {
    kitTitle: string;
    gridTitle: string;
    clickPadHint: string;
    rightHand: string;
    leftHand: string;
    kickFoot: string;
    accentLabel: string;
    normalLabel: string;
    ghostLabel: string;
    restLabel: string;
    coachTipLabel: string;
    selectedStep: string;
    voiceLabel: string;
    handLabel: string;
    dynamicLabel: string;
  };
  voices: {
    kick: string;
    snare: string;
    tom1: string;
    tom2: string;
    floor: string;
    hihat: string;
    crash: string;
    rest: string;
  };
  subdivisions: {
    '16th': string;
    triplet: string;
    sextuplet: string;
    quintuplet: string;
    septuplet: string;
    '32nd': string;
    nonuplet: string;
    linear: string;
  };
  levels: {
    all: string;
    custom: string;
    l1Title: string;
    l1Desc: string;
    l2Title: string;
    l2Desc: string;
    l3Title: string;
    l3Desc: string;
    l4Title: string;
    l4Desc: string;
    l5Title: string;
    l5Desc: string;
    l6Title: string;
    l6Desc: string;
  };
  tips: Record<string, string>;
  library: {
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    noResults: string;
    deleteCustom: string;
    targetLabel: string;
    stepsLabel: string;
  };
  editor: {
    modalTitleNew: string;
    modalTitleEdit: string;
    nameLabel: string;
    levelLabel: string;
    timeSigLabel: string;
    subdivisionLabel: string;
    stepsCountLabel: string;
    bpmLabel: string;
    tipLabel: string;
    presetClear: string;
    presetAlternating: string;
    presetLinearRlk: string;
    stepClickHint: string;
    saveChop: string;
    cancel: string;
  };
  profile: {
    title: string;
    activeProfile: string;
    newProfilePlaceholder: string;
    createBtn: string;
    deleteBtn: string;
    streakLabel: string;
    daysUnit: string;
    practiceTimeLabel: string;
    masteredCountLabel: string;
    practicedCountLabel: string;
    exportJson: string;
    importJson: string;
    importSuccess: string;
    importError: string;
    close: string;
  };
  gear: {
    heading: string;
    disclosure: string;
    items: Array<{ title: string; subtitle: string; cta: string; url: string }>;
  };
  editorial: {
    heading: string;
    intro: string;
    sections: Array<{ title: string; body: string }>;
    faqHeading: string;
    faqs: FaqItem[];
  };
  realExample: {
    tabTrainer: string;
    tabRealExample: string;
    realSpeedLabel: string;
    backingLabel: string;
    backingBoth: string;
    backingAcousticPiano: string;
    backingPiano: string;
    backingElectronic: string;
    backingOff: string;
    grooveBarsLabel: string;
    barUnit: string;
    barsUnit: string;
    phaseGroove: string;
    phaseChop: string;
    phaseResolve: string;
    hint: string;
  };
  footer: {
    copyright: string;
    localNotice: string;
  };
}

const en: TranslationBundle = {
  seo: {
    title: 'drumchopcue — Drum Chops Trainer, Animated Stickings & Real-Time BPM Studio',
    description:
      'Train drum chops, linear grooves, hockets, and polyrhythms 100% locally in your browser with Web Audio percussion, animated SVG stickings, and auto BPM ramps.',
    appDescription:
      '100% client-side drum chops practice trainer with Web Audio percussion synthesis, synchronized SVG stick animations, 6 progressive levels, and local JSON profiles.',
  },
  nav: {
    trainer: 'Trainer',
    library: 'Library',
    custom: 'Custom Chop',
    guide: 'Practice Guide',
    profilesBtn: 'Profiles & Backup',
  },
  hero: {
    title: 'Drum Chops & Linear Fills Studio',
    subtitle:
      'Train your drum chops, linear fills, sextuplets, and odd meters with synchronized SVG stickings, real-time speed control, and musical backing loops.',
    transparentNotice:
      '100% client-side drum chops practice trainer. Audio synthesis, visual animations, and local progress profiles run directly in your browser with zero API usage.',
  },
  controls: {
    play: 'Play',
    stop: 'Stop',
    loop: 'Loop',
    metronome: 'Click',
    soloClick: 'Solo Click',
    muteClick: 'Mute Click',
    silentKit: 'Acoustic Kit Mode',
    silentKitHint: 'Mutes kit synth, keeps SVG animation & click',
    volume: 'Volume',
    bpm: 'BPM',
    effectiveBpm: 'Effective',
    speed: 'Speed',
    bar: 'Bar',
    step: 'Step',
    viewBoth: 'Split View',
    viewKit: 'Kit Motion',
    viewGrid: 'Rhythm Grid',
    rampTitle: 'Auto BPM Ramp',
    rampEnable: 'Enable Ramp',
    rampStep: 'Step +BPM',
    rampEvery: 'Every',
    rampBarsUnit: 'bars',
    rampTarget: 'Target BPM',
    rampNextIn: 'Next bump in',
    markMastered: 'Mark Mastered',
    mastered: 'Mastered',
    bestBpm: 'Best',
    duplicateEdit: 'Edit Copy',
    createCustom: 'New Custom Chop',
  },
  stage: {
    kitTitle: 'Drum Kit & Stick Motion',
    gridTitle: 'Interactive Rhythm Grid',
    clickPadHint: 'Click any drum or step to audition',
    rightHand: 'Right (R)',
    leftHand: 'Left (L)',
    kickFoot: 'Kick (K)',
    accentLabel: 'Accent (>)',
    normalLabel: 'Normal',
    ghostLabel: 'Ghost (g)',
    restLabel: 'Rest',
    coachTipLabel: 'Execution Note',
    selectedStep: 'Inspected Step',
    voiceLabel: 'Voice',
    handLabel: 'Limb',
    dynamicLabel: 'Dynamic',
  },
  voices: {
    kick: 'Kick',
    snare: 'Snare',
    tom1: 'Tom 1',
    tom2: 'Tom 2',
    floor: 'Floor Tom',
    hihat: 'Hi-Hat',
    crash: 'Crash',
    rest: 'Rest',
  },
  subdivisions: {
    '16th': '16th Notes',
    triplet: 'Triplets',
    sextuplet: 'Sextuplets',
    quintuplet: 'Quintuplets (5s)',
    septuplet: 'Septuplets (7s)',
    '32nd': '32nd Notes',
    nonuplet: 'Nonuplets (9s)',
    linear: 'Linear 16ths',
  },
  levels: {
    all: 'All Levels',
    custom: 'My Chops',
    l1Title: 'Level 1 · Fundamentals & Mobility',
    l1Desc: 'Single/double orchestrations, 16th-note accents, and kick-supported fills.',
    l2Title: 'Level 2 · Linear Grooves & Hocket',
    l2Desc: 'Non-overlapping R/L/K cells, paradiddle-diddles, and lead-hand switches.',
    l3Title: 'Level 3 · Sextuplets & Tom Explosions',
    l3Desc: 'Six-stroke rolls, hertas, double-kick bursts, and deep ghost-note contrast.',
    l4Title: 'Level 4 · Polyrhythm & Odd Meters',
    l4Desc: 'Fives, sevens, 5/8, 7/8, 6/8 Afro-linear hockets, and groove-to-chop phrasing.',
    l5Title: 'Level 5 · Virtuoso 32nds & Metric Modulation',
    l5Desc: '32nd-note gospel bursts, 9-note nonuplets, 11/16 odd meters, and triplet-to-sextuplet shifts.',
    l6Title: 'Level 6 · Master Over-the-Barline Polymetry',
    l6Desc: '13/16 fusion labyrinths, 7-over-4 cycles, 9-cell barline shifts, and 48-step cadenzas.',
  },
  tips: {
    tip_rebound_even: 'Keep stick heights matched across snare and toms; let wrist rebound carry every transition.',
    tip_moeller_whip: 'Drop the accent with a relaxed Moeller whip, then freeze the tip 2 cm above the snare head for ghost notes.',
    tip_double_rebound: 'Control the second bounce with back fingers instead of forcing two separate arm motions.',
    tip_pivot_hips: 'Rotate smoothly from the waist toward the floor tom so your shoulders stay relaxed and centered.',
    tip_kick_heel_up: 'Play the double kick with a light ankle-bounce heel-up motion; never bury the beater before a fast hand rebound.',
    tip_paradiddle_low: 'Keep all unaccented diddles ultra-low on the snare so the orchestrated accents pop cleanly.',
    tip_triplet_flow: 'Count "1-trip-let 2-trip-let" internally so the transition from hands into the double kick stays locked.',
    tip_linear_space: 'No two limbs strike together. Focus on even spacing between kick and hands like a single continuous melody.',
    tip_weak_hand_lead: 'Lead with your non-dominant hand at 75% tempo first to eliminate subtle timing drag on left-led cells.',
    tip_ghost_contrast: 'Aim for at least a 4:1 volume ratio between ghosted inner snare taps and accented tom hits.',
    tip_six_stroke_accent: 'Frame the six-stroke roll (R ll rr L) by whipping only the first and sixth strokes.',
    tip_herta_snap: 'Snap the first two quick notes cleanly with finger rebound so the herta breathes before the tom accent.',
    tip_gospel_relax: 'Keep shoulders dropped during R-L-R-L-K-K bursts; breathe out on beat 1 so the tempo never rushes.',
    tip_odd_grouping: 'Feel the 5-note or 7-note cell against the steady quarter-note click rather than counting individual 32nds.',
    tip_odd_meter_anchor: 'Anchor the groove internally using 2-beat and 3-beat subdivisions (e.g., 2+2+3 for 7/8).',
    tip_compound_pulse: 'Lock the dotted-quarter pulse in 6/8 while letting the linear tom melody dance over the barline.',
    tip_transition_resolve: 'Keep your hi-hat hand steady in the pocket and commit cleanly to the beat-1 crash resolution.',
    tip_32nd_fingers: 'Use pure finger rebound for 32nd-note inner taps; keep sticks within 3 cm of the drumhead between accents.',
    tip_nonuplet_feel: 'Think of 9-note nonuplets as three fast triplets per beat (3+3+3) so the downbeat stays relaxed.',
    tip_odd_11_13: 'Subdivide 11/16 (3+3+3+2) and 13/16 (3+3+3+2+2) vocally before transferring the melody to the kit.',
    tip_modulation_anchor: 'Keep the quarter-note pulse identical in your body while shifting smoothly between triplet and sextuplet gears.',
    tip_over_barline: 'Trust the recurring sticking accent rather than the barline; your crash resolution will land naturally on beat 1.',
  },
  library: {
    heading: 'Chop Library & Difficulty Progression',
    subheading: 'Choose a pattern from 6 progressive tiers or build your own custom orchestration.',
    searchPlaceholder: 'Search chop, sticking, or voice...',
    noResults: 'No chop patterns match the current filter.',
    deleteCustom: 'Delete',
    targetLabel: 'Goal',
    stepsLabel: 'steps',
  },
  editor: {
    modalTitleNew: 'Create Custom Drum Chop',
    modalTitleEdit: 'Edit Custom Drum Chop',
    nameLabel: 'Chop Name',
    levelLabel: 'Difficulty Level',
    timeSigLabel: 'Time Signature',
    subdivisionLabel: 'Subdivision',
    stepsCountLabel: 'Steps',
    bpmLabel: 'Default BPM',
    tipLabel: 'Technical Coaching Note',
    presetClear: 'Clear All',
    presetAlternating: 'Alternating R/L',
    presetLinearRlk: 'Linear R-L-K',
    stepClickHint: 'Click a step to cycle Voice, or adjust Hand & Dynamic below each column.',
    saveChop: 'Save Chop to Profile',
    cancel: 'Cancel',
  },
  profile: {
    title: 'Practice Profiles & JSON Backup',
    activeProfile: 'Active Profile',
    newProfilePlaceholder: 'New drummer profile name...',
    createBtn: 'Create Profile',
    deleteBtn: 'Delete Profile',
    streakLabel: 'Daily Streak',
    daysUnit: 'days',
    practiceTimeLabel: 'Practice Time',
    masteredCountLabel: 'Mastered',
    practicedCountLabel: 'Practiced',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    importSuccess: 'Profiles imported successfully.',
    importError: 'Invalid drumchopcue JSON backup file.',
    close: 'Close',
  },
  gear: {
    heading: 'Essential Practice Gear for Chop Building',
    disclosure: 'Recommended tools for quiet pad work, stick control, and hearing protection (affiliate links).',
    items: [
      {
        title: '12" Dual-Surface Practice Pad',
        subtitle: 'Gum rubber & high-resistance foam for clean rebound and finger endurance.',
        cta: 'View Pad Options',
        url: 'https://www.amazon.com/s?k=12+inch+drum+practice+pad',
      },
      {
        title: 'American Hickory 5A / 5B Sticks',
        subtitle: 'Matched-weight hickory pairs for balanced wrist fulcrum and tom articulation.',
        cta: 'Browse Drumsticks',
        url: 'https://www.amazon.com/s?k=hickory+5a+drumsticks',
      },
      {
        title: 'Isolation In-Ear Monitors / Headphones',
        subtitle: '25 dB+ passive isolation to lock cleanly onto drumchopcue’s click on acoustic kits.',
        cta: 'Compare Monitors',
        url: 'https://www.amazon.com/s?k=drummer+isolation+in+ear+monitors',
      },
      {
        title: 'Stick Control & Rudimental Method Books',
        subtitle: 'Classic sticking encyclopedias to pair with linear kit orchestrations.',
        cta: 'Explore Books',
        url: 'https://www.amazon.com/s?k=stick+control+for+the+snare+drummer',
      },
    ],
  },
  editorial: {
    heading: 'How to Master Drum Chops Without Tension or Losing the Groove',
    intro:
      'Speed on the drums is a byproduct of relaxation, clean subdivision awareness, and economy of motion. Use this structured workflow to turn complex stickings into musical vocabulary.',
    sections: [
      {
        title: '1. Rudiments vs. Linear Chops vs. Kit Orchestration',
        body: 'Rudiments (single strokes, doubles, paradiddles, six-stroke rolls) train hand symmetry and rebound mechanics on one surface. Linear drumming removes simultaneous limb hits so kick, snare, hi-hat, and toms speak one note at a time—creating crisp separation at high tempos. Orchestration is the musical bridge: placing accents on cymbals or floor toms while keeping ghost notes low on the snare.',
      },
      {
        title: '2. Using the Auto BPM Ramp Without Micro-Tension',
        body: 'Start at a tempo where every ghost note and kick placement feels effortless (typically 60–75% of your goal). Enable drumchopcue’s Auto BPM Ramp to climb +2 to +4 BPM every 4 or 8 bars. Whenever your forearms tighten or notes smear together, step down 8 BPM or switch to 0.75x speed to rebuild muscle memory cleanly.',
      },
      {
        title: '3. Dynamic Contrast: Why Ghost Notes Make Chops Sound Fast',
        body: 'Fast chops sound cluttered when every stroke is played at mezzo-forte. Lowering unaccented snare taps to 2–3 cm off the head creates dramatic dynamic headroom. That contrast makes your tom accents and crash resolutions cut through any mix while actually conserving physical energy.',
      },
    ],
    faqHeading: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'How does drumchopcue run without a server or AI API key?',
        a: 'All drum sounds are synthesized deterministically in real time via your browser’s Web Audio API, SVG stick animations sync via requestAnimationFrame, and your progress is stored locally in localStorage with JSON export/import.',
      },
      {
        q: 'What is the difference between rudiments, linear chops, and drum orchestration?',
        a: 'Rudiments build sticking mechanics on a single pad, linear chops forbid simultaneous limb hits so every note has clear space, and orchestration maps those stickings musically across snare, toms, kick, and cymbals.',
      },
      {
        q: 'How should I use Acoustic Kit Mode?',
        a: 'Toggle Acoustic Kit Mode to mute drumchopcue’s synthesized snare, toms, and kick while keeping the metronome click and animated SVG sticking cursor active—ideal when practicing on an acoustic drum set or e-drum kit.',
      },
      {
        q: 'How do I back up my practiced chops and custom patterns?',
        a: 'Open Profiles & Backup to export a JSON file containing your mastered chops, personal BPM records, practice streak, and custom-created patterns. You can re-import that file on any browser.',
      },
    ],
  },
  realExample: {
    tabTrainer: 'Practice Trainer',
    tabRealExample: 'Real Example',
    realSpeedLabel: 'Real Speed',
    backingLabel: 'Backing Loop',
    backingBoth: 'Piano + Synth',
    backingAcousticPiano: 'Acoustic Piano',
    backingPiano: 'Electric Piano',
    backingElectronic: 'Electronic Synth',
    backingOff: 'Drums Only',
    grooveBarsLabel: 'Base Groove',
    barUnit: 'bar',
    barsUnit: 'bars',
    phaseGroove: 'Base Groove',
    phaseChop: 'Chop Fill',
    phaseResolve: 'Resolve 1',
    hint: 'Plays a matching pocket groove over comping acoustic piano, Rhodes chords & synth bass before launching into the chop at full performance tempo.',
  },
  footer: {
    copyright: 'drumchopcue · Deterministic Drum Chops Practice Studio',
    localNotice: 'All audio, SVG motion, and profile data run 100% locally in your browser.',
  },
};

const es: TranslationBundle = {
  seo: {
    title: 'drumchopcue — Entrenador de Drum Chops, Digitaciones SVG y Estudio BPM',
    description:
      'Entrena drum chops, grooves lineales, hockets y polirritmias 100 % en tu navegador con síntesis Web Audio, baquetas animadas en SVG y rampa automática de BPM.',
    appDescription:
      'Entrenador de batería 100 % local con síntesis de percusión Web Audio, animación SVG sincronizada, 6 niveles progresivos y perfiles en JSON.',
  },
  nav: {
    trainer: 'Entrenador',
    library: 'Biblioteca',
    custom: 'Chop Propio',
    guide: 'Guía Rítmica',
    profilesBtn: 'Perfiles y JSON',
  },
  hero: {
    title: 'Estudio de Drum Chops y Fills Lineales',
    subtitle:
      'Entrena tus drum chops, fills lineales, sextillos y métricas impares con regulación de velocidad, animación SVG sincronizada y ejemplo musical real.',
    transparentNotice:
      'Entrenador de drum chops 100 % del lado del cliente. La síntesis de audio, animaciones visuales y perfiles locales se ejecutan en tu navegador sin usar APIs.',
  },
  controls: {
    play: 'Reproducir',
    stop: 'Detener',
    loop: 'Bucle',
    metronome: 'Clic',
    soloClick: 'Solo Clic',
    muteClick: 'Silenciar Clic',
    silentKit: 'Modo Batería Acústica',
    silentKitHint: 'Silencia el kit sintetizado; mantiene animación SVG y clic',
    volume: 'Volumen',
    bpm: 'BPM',
    effectiveBpm: 'Efectivo',
    speed: 'Velocidad',
    bar: 'Compás',
    step: 'Paso',
    viewBoth: 'Vista Dual',
    viewKit: 'Vista de Kit',
    viewGrid: 'Cuadrícula',
    rampTitle: 'Rampa Automática de BPM',
    rampEnable: 'Activar Rampa',
    rampStep: 'Subir +BPM',
    rampEvery: 'Cada',
    rampBarsUnit: 'compases',
    rampTarget: 'BPM Objetivo',
    rampNextIn: 'Siguiente subida en',
    markMastered: 'Marcar Dominado',
    mastered: 'Dominado',
    bestBpm: 'Récord',
    duplicateEdit: 'Editar Copia',
    createCustom: 'Crear Chop Propio',
  },
  stage: {
    kitTitle: 'Batería y Movimiento de Baquetas',
    gridTitle: 'Cuadrícula Rítmica Interactiva',
    clickPadHint: 'Haz clic en cualquier pieza o paso para escucharlo',
    rightHand: 'Derecha (R)',
    leftHand: 'Izquierda (L)',
    kickFoot: 'Bombo (K)',
    accentLabel: 'Acento (>)',
    normalLabel: 'Normal',
    ghostLabel: 'Fantasma (g)',
    restLabel: 'Silencio',
    coachTipLabel: 'Consejo Técnico',
    selectedStep: 'Paso Seleccionado',
    voiceLabel: 'Pieza',
    handLabel: 'Extremidad',
    dynamicLabel: 'Dinámica',
  },
  voices: {
    kick: 'Bombo',
    snare: 'Caja',
    tom1: 'Tom 1',
    tom2: 'Tom 2',
    floor: 'Floor Tom',
    hihat: 'Hi-Hat',
    crash: 'Crash',
    rest: 'Silencio',
  },
  subdivisions: {
    '16th': 'Semicorcheas',
    triplet: 'Tresillos',
    sextuplet: 'Sextillos',
    quintuplet: 'Quintillos (5)',
    septuplet: 'Septillos (7)',
    '32nd': 'Fusas (32nd)',
    nonuplet: 'Nonillos (9)',
    linear: 'Lineal (Semic.)',
  },
  levels: {
    all: 'Todos los Niveles',
    custom: 'Mis Chops',
    l1Title: 'Nivel 1 · Fundamentos y Movilidad',
    l1Desc: 'Singles/doubles desplazados, acentos de semicorchea y fills con bombo.',
    l2Title: 'Nivel 2 · Linear Grooves y Hocket',
    l2Desc: 'Celdas R/L/K sin golpes simultáneos, paradiddle-diddles y cambio de mano líder.',
    l3Title: 'Nivel 3 · Sextillos y Explosiones de Toms',
    l3Desc: 'Six-stroke rolls, hertas, doble bombo rápido y contraste con ghost notes.',
    l4Title: 'Nivel 4 · Polirritmia y Métricas Impares',
    l4Desc: 'Grupos de 5 y 7, compases 5/8, 7/8, 6/8 y transiciones groove → chop.',
    l5Title: 'Nivel 5 · Virtuoso: Fusas y Modulación Métrica',
    l5Desc: 'Ráfagas gospel en fusas, nonillos de 9 notas, compases 11/16 y cambios de tresillo a sextillo.',
    l6Title: 'Nivel 6 · Master: Polimetría Sobre el Compás',
    l6Desc: 'Laberintos en 13/16, ciclos 7 sobre 4, celdas de 9 sobre barra de compás y cadencias de 48 pasos.',
  },
  tips: {
    tip_rebound_even: 'Iguala la altura de las baquetas entre caja y toms; deja que el rebote de muñeca guíe cada cambio.',
    tip_moeller_whip: 'Lanza el acento con látigo Moeller relajado y detén la punta a 2 cm del parche para las notas fantasma.',
    tip_double_rebound: 'Controla el segundo golpe con los dedos traseros usando el rebote natural del parche.',
    tip_pivot_hips: 'Gira suavemente desde la cadera hacia el floor tom para mantener los hombros relajados.',
    tip_kick_heel_up: 'Ejecuta el doble bombo con rebote ligero de tobillo (heel-up), sin enterrar la maza antes de volver a las manos.',
    tip_paradiddle_low: 'Mantén los dobles sin acento muy bajos en la caja para que los acentos orquestados resalten.',
    tip_triplet_flow: 'Subdivide internamente en tresillos para que la entrada al doble bombo conserve el pulso exacto.',
    tip_linear_space: 'Ninguna extremidad golpea a la vez. Busca espaciado uniforme entre bombo y manos como una melodía.',
    tip_weak_hand_lead: 'Practica liderando con tu mano débil al 75 % de tempo para eliminar retrasos en celdas invertidas.',
    tip_ghost_contrast: 'Busca una relación de volumen mínima de 4:1 entre las notas fantasma y los acentos en toms.',
    tip_six_stroke_accent: 'Enmarca el six-stroke roll (R ll rr L) acentuando solo el primer y el sexto golpe.',
    tip_herta_snap: 'Ejecuta las dos primeras notas rápidas con rebote de dedos para que la herta respire antes del tom.',
    tip_gospel_relax: 'Mantén los hombros sueltos en las ráfagas R-L-R-L-K-K y exhala en el tiempo 1 para no acelerar.',
    tip_odd_grouping: 'Siente la agrupación de 5 o 7 contra el pulso estable del metrónomo sin contar cada fusa.',
    tip_odd_meter_anchor: 'Ancla la métrica impar internamente mediante bloques de 2 y 3 pulsos (ej. 2+2+3 en 7/8).',
    tip_compound_pulse: 'Sostén el pulso de negra con puntillo en 6/8 mientras la melodía lineal fluye sobre el compás.',
    tip_transition_resolve: 'Mantén el hi-hat firme en el groove y comprométete con limpieza al crash de resolución en el 1.',
    tip_32nd_fingers: 'Usa puro rebote de dedos en las fusas internas y mantén las puntas a menos de 3 cm del parche.',
    tip_nonuplet_feel: 'Piensa los nonillos de 9 como tres tresillos rápidos por pulso (3+3+3) para no perder el tiempo 1.',
    tip_odd_11_13: 'Canta la subdivisión de 11/16 (3+3+3+2) y 13/16 (3+3+3+2+2) antes de orquestarla en los toms.',
    tip_modulation_anchor: 'Mantén intacto el pulso de negra en el cuerpo al cambiar de marcha de tresillos a sextillos.',
    tip_over_barline: 'Confía en la acentuación recurrente de la celda sobre la línea de compás; la resolución caerá limpia en el 1.',
  },
  library: {
    heading: 'Biblioteca de Chops por Niveles',
    subheading: 'Elige un patrón entre 6 niveles progresivos o diseña tu propia orquestación.',
    searchPlaceholder: 'Buscar chop, digitación o pieza...',
    noResults: 'No hay patrones que coincidan con el filtro.',
    deleteCustom: 'Eliminar',
    targetLabel: 'Meta',
    stepsLabel: 'pasos',
  },
  editor: {
    modalTitleNew: 'Crear Chop Personalizado',
    modalTitleEdit: 'Editar Chop Personalizado',
    nameLabel: 'Nombre del Chop',
    levelLabel: 'Nivel de Dificultad',
    timeSigLabel: 'Compás',
    subdivisionLabel: 'Subdivisión',
    stepsCountLabel: 'Pasos',
    bpmLabel: 'BPM Inicial',
    tipLabel: 'Consejo Técnico',
    presetClear: 'Limpiar Todo',
    presetAlternating: 'Alterno R/L',
    presetLinearRlk: 'Lineal R-L-K',
    stepClickHint: 'Haz clic en cada paso para rotar la pieza o ajusta mano y dinámica debajo.',
    saveChop: 'Guardar en Perfil',
    cancel: 'Cancelar',
  },
  profile: {
    title: 'Perfiles Locales y Copia JSON',
    activeProfile: 'Perfil Activo',
    newProfilePlaceholder: 'Nombre del nuevo perfil...',
    createBtn: 'Crear Perfil',
    deleteBtn: 'Eliminar Perfil',
    streakLabel: 'Racha Diaria',
    daysUnit: 'días',
    practiceTimeLabel: 'Tiempo Total',
    masteredCountLabel: 'Dominados',
    practicedCountLabel: 'Practicados',
    exportJson: 'Exportar JSON',
    importJson: 'Importar JSON',
    importSuccess: 'Perfiles importados correctamente.',
    importError: 'Archivo JSON de respaldo inválido.',
    close: 'Cerrar',
  },
  gear: {
    heading: 'Equipamiento Recomendado para Estudiar Chops',
    disclosure: 'Material contextual para estudio en pad, control de baquetas y protección auditiva (enlaces de afiliado).',
    items: [
      {
        title: 'Pad de Práctica 12" Doble Superficie',
        subtitle: 'Goma natural y superficie blanda para trabajar rebote y resistencia de dedos.',
        cta: 'Ver Pads',
        url: 'https://www.amazon.com/s?k=12+inch+drum+practice+pad',
      },
      {
        title: 'Baquetas Nogal Americano 5A / 5B',
        subtitle: 'Pares emparejados por peso para un punto de pivote equilibrado en toms y caja.',
        cta: 'Ver Baquetas',
        url: 'https://www.amazon.com/s?k=hickory+5a+drumsticks',
      },
      {
        title: 'Auriculares In-Ear de Aislamiento',
        subtitle: 'Aislamiento pasivo +25 dB para seguir el clic de drumchopcue sobre batería acústica.',
        cta: 'Ver Auriculares',
        url: 'https://www.amazon.com/s?k=drummer+isolation+in+ear+monitors',
      },
      {
        title: 'Libros Clásicos de Rudimentos',
        subtitle: 'Métodos de Stick Control para combinar con orquestaciones lineales.',
        cta: 'Ver Libros',
        url: 'https://www.amazon.com/s?k=stick+control+for+the+snare+drummer',
      },
    ],
  },
  editorial: {
    heading: 'Cómo Estudiar Drum Chops Sin Tensión y Sin Perder el Groove',
    intro:
      'La velocidad real en la batería nace de la relajación, la precisión en la subdivisión y la economía de movimiento. Aplica este método para convertir cualquier digitación en lenguaje musical.',
    sections: [
      {
        title: '1. Diferencia entre Rudimentos, Linear Chops y Orquestación',
        body: 'Los rudimentos (golpes simples, dobles, paradiddles, six-stroke rolls) desarrollan mecánica y rebote en una sola superficie. Los linear chops evitan golpes simultáneos entre manos y bombo para que cada nota suene nítida incluso a gran velocidad. La orquestación traslada esas digitaciones por caja, toms, hi-hat y platos con sentido melódico.',
      },
      {
        title: '2. Uso Inteligente de la Rampa de BPM',
        body: 'Empieza siempre a un tempo donde las notas fantasma y el bombo fluyan sin rigidez. Activa la rampa automática para subir +2 o +4 BPM cada 4 u 8 compases. Si notas tensión en antebrazos o imprecisión en los tresillos, baja 8 BPM o usa el multiplicador 0.75x para consolidar el movimiento.',
      },
      {
        title: '3. Contraste Dinámico y Ghost Notes',
        body: 'Un chop suena plano si todas las notas tienen el mismo volumen. Mantén las ghost notes a 2 cm del parche mientras proyectas los acentos hacia los toms o el crash: ganarás claridad rítmica y ahorrarás energía física.',
      },
    ],
    faqHeading: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Cómo funciona drumchopcue sin servidor ni clave API de IA?',
        a: 'Todos los sonidos percusivos se sintetizan en tiempo real mediante la Web Audio API del navegador, las animaciones SVG se sincronizan con requestAnimationFrame y tu progreso se guarda localmente en localStorage con exportación JSON.',
      },
      {
        q: '¿Qué diferencia hay entre rudimentos, linear chops y orquestación?',
        a: 'Los rudimentos entrenan patrones de manos en una superficie, los linear chops separan cada extremidad para no coincidir en el mismo instante, y la orquestación reparte esos golpes musicalmente por toda la batería.',
      },
      {
        q: '¿Para qué sirve el Modo Batería Acústica?',
        a: 'Silencia el kit sintetizado de drumchopcue pero mantiene activos el clic de metrónomo y la animación visual de baquetas y cursor, permitiéndote tocar encima con tu batería acústica o electrónica.',
      },
      {
        q: '¿Puedo guardar mis patrones propios y récords de BPM?',
        a: 'Sí. Crea perfiles locales y usa Exportar / Importar JSON para respaldar o transferir tus chops personalizados, récords de velocidad y rachas diarias.',
      },
    ],
  },
  realExample: {
    tabTrainer: 'Modo Práctica',
    tabRealExample: 'Ejemplo Real',
    realSpeedLabel: 'Velocidad Real',
    backingLabel: 'Base Musical',
    backingBoth: 'Piano + Synth',
    backingAcousticPiano: 'Piano Acústico',
    backingPiano: 'Piano Eléctrico',
    backingElectronic: 'Synth Electrónico',
    backingOff: 'Solo Batería',
    grooveBarsLabel: 'Ritmo Base',
    barUnit: 'compás',
    barsUnit: 'compases',
    phaseGroove: 'Ritmo Base',
    phaseChop: 'Ejecución Chop',
    phaseResolve: 'Cierre en 1',
    hint: 'Reproduce un ritmo base con piano acústico rítmico, Rhodes y bajo electrónico a la velocidad real del chop antes de entrar al fill.',
  },
  footer: {
    copyright: 'drumchopcue · Estudio Determinista de Drum Chops',
    localNotice: 'Síntesis de audio, animación SVG y perfiles ejecutados 100 % en tu navegador.',
  },
};

const fr: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — Entraîneur de Drum Chops, Doigtés SVG & Studio BPM',
    description:
      'Travaillez vos drum chops, grooves linéaires, hockets et polyrythmies 100 % localement avec synthèse Web Audio, baguettes SVG animées et rampe BPM.',
    appDescription:
      'Studio d’entraînement batterie 100 % client-side avec synthèse Web Audio, animations SVG synchronisées, 6 niveaux progressifs et profils JSON.',
  },
  nav: {
    trainer: 'Studio',
    library: 'Bibliothèque',
    custom: 'Chop Perso',
    guide: 'Guide',
    profilesBtn: 'Profils & JSON',
  },
  hero: {
    title: 'Studio de Drum Chops & Fills Linéaires',
    subtitle:
      'Entraînez vos drum chops, fills linéaires, sextolets et mesures impaires avec contrôle de vitesse, baguettes SVG et exemple musical réel.',
    transparentNotice:
      'Entraîneur de drum chops 100 % côté client. Synthèse audio, animations visuelles et profils locaux s’exécutent directement dans votre navigateur sans API.',
  },
  controls: {
    ...en.controls,
    play: 'Lecture',
    stop: 'Stop',
    loop: 'Boucle',
    metronome: 'Clic',
    soloClick: 'Clic Solo',
    muteClick: 'Muet Clic',
    silentKit: 'Mode Batterie Acoustique',
    silentKitHint: 'Coupe le kit synthétisé, garde l’animation SVG et le clic',
    volume: 'Volume',
    speed: 'Vitesse',
    bar: 'Mesure',
    step: 'Pas',
    viewBoth: 'Vue Double',
    viewKit: 'Vue Batterie',
    viewGrid: 'Grille',
    rampTitle: 'Rampe BPM Auto',
    rampEnable: 'Activer',
    rampEvery: 'Chaque',
    rampBarsUnit: 'mesures',
    rampTarget: 'BPM Cible',
    markMastered: 'Maîtrisé',
    mastered: 'Maîtrisé',
    createCustom: 'Nouveau Chop',
  },
  levels: {
    ...en.levels,
    all: 'Tous Niveaux',
    custom: 'Mes Chops',
    l1Title: 'Niveau 1 · Fondamentaux & Mobilité',
    l1Desc: 'Coups simples/doubles orchestrés, accents en doubles-croches et fills avec grosse caisse.',
    l2Title: 'Niveau 2 · Grooves Linéaires & Hocket',
    l2Desc: 'Cellules R/L/K sans frappes simultanées, paradiddle-diddles et changements de main.',
    l3Title: 'Niveau 3 · Sextolets & Explosions de Toms',
    l3Desc: 'Six-stroke rolls, hertas, doubles coups de pied et contraste des notes fantômes.',
    l4Title: 'Niveau 4 · Polyrythmie & Mesures Impaires',
    l4Desc: 'Quintuplets, septolets, 5/8, 7/8, 6/8 afro-linéaire et transitions groove → chop.',
    l5Title: 'Niveau 5 · Virtuose : Triples-Croches & Modulation',
    l5Desc: 'Riffs gospel en triples-croches, nonolets (9), mesures en 11/16 et modulations métriques.',
    l6Title: 'Niveau 6 · Master : Polymétrie Hors-Mesure',
    l6Desc: 'Labyrinthes en 13/16, cycles 7 sur 4, décalages à cheval sur la barre et cadences 48 pas.',
  },
  editorial: {
    ...en.editorial,
    heading: 'Comment travailler les Drum Chops sans tension et sans perdre le groove',
    faqHeading: 'Questions fréquentes',
    faqs: [
      {
        q: 'Comment drumchopcue fonctionne-t-il sans serveur ni clé API ?',
        a: 'Les sons sont synthétisés en temps réel via Web Audio API, les baguettes SVG suivent le tempo via requestAnimationFrame et la progression est sauvegardée dans localStorage avec export JSON.',
      },
      {
        q: 'Quelle différence entre rudiments, linear chops et orchestration ?',
        a: 'Les rudiments forment la mécanique des mains, le jeu linéaire supprime les frappes simultanées et l’orchestration répartit les accents sur la caisse claire, les toms, la grosse caisse et les cymbales.',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: 'Mode Entraînement',
    tabRealExample: 'Exemple Réel',
    realSpeedLabel: 'Tempo Réel',
    backingLabel: 'Accompagnement',
    backingBoth: 'Piano + Synthé',
    backingAcousticPiano: 'Piano Acoustique',
    backingPiano: 'Piano Électrique',
    backingElectronic: 'Synthé Électronique',
    backingOff: 'Batterie Seule',
    grooveBarsLabel: 'Groove de Base',
    barUnit: 'mesure',
    barsUnit: 'mesures',
    phaseGroove: 'Groove de Base',
    phaseChop: 'Exécution Chop',
    phaseResolve: 'Résolution sur 1',
    hint: 'Joue un groove assorti sur piano électrique Rhodes / basse synthé à la vitesse réelle du chop avant d’enchaîner le fill.',
  },
};

const de: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — Drum Chops Trainer, Animierte Stickings & BPM-Studio',
    description:
      'Trainiere Drum Chops, lineare Grooves, Hockets und Polyrhythmik 100 % lokal im Browser mit Web-Audio-Synthese, SVG-Stick-Animation und BPM-Rampe.',
    appDescription:
      '100 % clientseitiger Drum-Chops-Trainer mit Web-Audio-Synthese, synchronisierter SVG-Animation, 6 Levels und JSON-Profilen.',
  },
  nav: {
    trainer: 'Trainer',
    library: 'Bibliothek',
    custom: 'Eigener Chop',
    guide: 'Praxis-Guide',
    profilesBtn: 'Profile & JSON',
  },
  hero: {
    title: 'Drum Chops & Lineare Fills Studio',
    subtitle:
      'Trainiere deine Drum Chops, lineare Fills, Sextolen und ungerade Taktarten mit präziser Temposteuerung, SVG-Sticks und Real-Groove-Loop.',
    transparentNotice:
      '100 % clientseitiger Drum-Chops-Trainer. Audiosynthese, visuelle Animationen und lokale Profile laufen direkt im Browser ohne API-Nutzung.',
  },
  controls: {
    ...en.controls,
    play: 'Start',
    stop: 'Stopp',
    loop: 'Schleife',
    metronome: 'Klick',
    soloClick: 'Nur Klick',
    muteClick: 'Klick Aus',
    silentKit: 'Akustik-Kit-Modus',
    silentKitHint: 'Schaltet Drum-Synth stumm, behält SVG-Animation & Klick',
    volume: 'Lautstärke',
    speed: 'Tempo',
    bar: 'Takt',
    step: 'Schritt',
    viewBoth: 'Geteilte Ansicht',
    viewKit: 'Schlagzeug',
    viewGrid: 'Rhythmus-Raster',
    rampTitle: 'Auto-BPM-Rampe',
    rampEnable: 'Rampe aktiv',
    rampEvery: 'Alle',
    rampBarsUnit: 'Takte',
    rampTarget: 'Ziel-BPM',
    markMastered: 'Gemeistert',
    mastered: 'Gemeistert',
    createCustom: 'Neuer Chop',
  },
  levels: {
    ...en.levels,
    all: 'Alle Level',
    custom: 'Eigene Chops',
    l1Title: 'Level 1 · Grundlagen & Mobilität',
    l1Desc: 'Singles/Doubles über Toms, 16tel-Akzente und Fills mit Kick-Unterstützung.',
    l2Title: 'Level 2 · Lineare Grooves & Hocket',
    l2Desc: 'Überlappungsfreie R/L/K-Muster, Paradiddle-Diddles und Führhandwechsel.',
    l3Title: 'Level 3 · Sextolen & Tom-Explosionen',
    l3Desc: 'Six-Stroke Rolls, Hertas, Doppel-Kick-Bursts und Ghost-Note-Dynamik.',
    l4Title: 'Level 4 · Polyrhythmik & Ungerade Takte',
    l4Desc: '5er- und 7er-Gruppen, 5/8, 7/8, 6/8 und fließende Groove-zu-Chop-Übergänge.',
    l5Title: 'Level 5 · Virtuose: 32tel & Metrische Modulation',
    l5Desc: '32tel-Gospel-Bursts, 9er-Nonolen, 11/16-Takte und Triolen-zu-Sextolen-Wechsel.',
    l6Title: 'Level 6 · Master: Over-the-Barline Polymetrik',
    l6Desc: '13/16-Fusion-Zyklen, 7-über-4-Matrizen, taktgrenzenüberschreitende Phrasen und 48-Step-Kadenzen.',
  },
  editorial: {
    ...en.editorial,
    heading: 'Drum Chops locker und im Groove meistern',
    faqHeading: 'Häufig gestellte Fragen',
    faqs: [
      {
        q: 'Wie funktioniert drumchopcue ohne Server oder KI-API-Key?',
        a: 'Alle Schlagzeug-Sounds werden in Echtzeit über die Web Audio API synthetisiert, SVG-Animationen laufen lokal und Fortschritte werden per localStorage und JSON-Backup gesichert.',
      },
      {
        q: 'Was unterscheidet Rudiments, Linear Chops und Orchestrierung?',
        a: 'Rudiments trainieren Handsätze auf einer Fläche, Linear Chops vermeiden gleichzeitige Schläge und die Orchestrierung verteilt Akzente musikalisch über Snare, Toms, Kick und Becken.',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: 'Übungsmodus',
    tabRealExample: 'Reales Beispiel',
    realSpeedLabel: 'Original-Tempo',
    backingLabel: 'Begleit-Loop',
    backingBoth: 'Piano + Synth',
    backingAcousticPiano: 'Akustik-Piano',
    backingPiano: 'E-Piano',
    backingElectronic: 'Elektro-Synth',
    backingOff: 'Nur Drums',
    grooveBarsLabel: 'Basis-Groove',
    barUnit: 'Takt',
    barsUnit: 'Takte',
    phaseGroove: 'Basis-Groove',
    phaseChop: 'Chop-Fill',
    phaseResolve: 'Auflösung 1',
    hint: 'Spielt einen passenden Basis-Groove über Rhodes-E-Piano und Synth-Bass im Originaltempo, bevor der Chop einsetzt.',
  },
};

const pt: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — Treinador de Drum Chops, Manulação SVG e Estúdio BPM',
    description:
      'Treine drum chops, grooves lineares, hockets e polirritmias 100% no navegador com síntese Web Audio, baquetas SVG animadas e rampa de BPM.',
    appDescription:
      'Estúdio de prática de bateria 100% local com síntese Web Audio, animação SVG sincronizada, 6 níveis progressivos e perfis JSON.',
  },
  nav: {
    trainer: 'Treinador',
    library: 'Biblioteca',
    custom: 'Chop Próprio',
    guide: 'Guia',
    profilesBtn: 'Perfis e JSON',
  },
  hero: {
    title: 'Estúdio de Drum Chops e Fills Lineares',
    subtitle:
      'Treine seus drum chops, viradas lineares, sextinas e compassos ímpares com controle de velocidade, baquetas SVG e exemplo musical real.',
    transparentNotice:
      'Treinador de drum chops 100% client-side. Síntese de áudio, animações visuais e perfis locais rodam diretamente no navegador sem uso de API.',
  },
  controls: {
    ...en.controls,
    play: 'Tocar',
    stop: 'Parar',
    loop: 'Loop',
    metronome: 'Clique',
    soloClick: 'Só Clique',
    muteClick: 'Mudo Clique',
    silentKit: 'Modo Bateria Acústica',
    silentKitHint: 'Silencia o kit sintetizado, mantendo animação SVG e clique',
    volume: 'Volume',
    speed: 'Velocidade',
    bar: 'Compasso',
    step: 'Passo',
    viewBoth: 'Visão Dupla',
    viewKit: 'Bateria',
    viewGrid: 'Grade Rítmica',
    rampTitle: 'Rampa Automática de BPM',
    rampEnable: 'Ativar Rampa',
    rampEvery: 'A cada',
    rampBarsUnit: 'compassos',
    rampTarget: 'BPM Alvo',
    markMastered: 'Marcar Dominado',
    mastered: 'Dominado',
    createCustom: 'Novo Chop',
  },
  levels: {
    ...en.levels,
    all: 'Todos os Níveis',
    custom: 'Meus Chops',
    l1Title: 'Nível 1 · Fundamentos e Mobilidade',
    l1Desc: 'Toques simples/duplos orquestrados, acentos de semicolcheia e viradas com bumbo.',
    l2Title: 'Nível 2 · Grooves Lineares e Hocket',
    l2Desc: 'Células R/L/K sem golpes simultâneos, paradiddle-diddles e troca de mão líder.',
    l3Title: 'Nível 3 · Sextinas e Explosões nos Toms',
    l3Desc: 'Six-stroke rolls, hertas, bumbo duplo rápido e contraste de notas fantasma.',
    l4Title: 'Nível 4 · Polirritmia e Compassos Ímpares',
    l4Desc: 'Grupos de 5 e 7, 5/8, 7/8, 6/8 afro-linear e transições groove → chop.',
    l5Title: 'Nível 5 · Virtuoso: Fusas e Modulação Métrica',
    l5Desc: 'Rajadas gospel em fusas (32nd), noninas (9), 11/16 e mudanças de tercina para sextina.',
    l6Title: 'Nível 6 · Master: Polimetria Além da Barra',
    l6Desc: 'Labirintos em 13/16, ciclos 7-sobre-4, células de 9 notas e cadências de 48 passos.',
  },
  editorial: {
    ...en.editorial,
    heading: 'Como estudar Drum Chops sem tensão e sem perder o groove',
    faqHeading: 'Perguntas Frequentes',
    faqs: [
      {
        q: 'Como o drumchopcue funciona sem servidor ou chave de API?',
        a: 'Todos os sons são sintetizados em tempo real pela Web Audio API do navegador, as animações SVG sincronizam localmente e o progresso é salvo em localStorage com backup JSON.',
      },
      {
        q: 'Qual a diferença entre rudimentos, linear chops e orquestração?',
        a: 'Rudimentos desenvolvem o controle das mãos, linear chops separam cada membro sem notas simultâneas e a orquestração distribui os acentos entre caixa, toms, bumbo e pratos.',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: 'Modo Prática',
    tabRealExample: 'Exemplo Real',
    realSpeedLabel: 'Velocidade Real',
    backingLabel: 'Base Musical',
    backingBoth: 'Piano + Synth',
    backingAcousticPiano: 'Piano Acústico',
    backingPiano: 'Piano Elétrico',
    backingElectronic: 'Synth Eletrônico',
    backingOff: 'Só Bateria',
    grooveBarsLabel: 'Groove Base',
    barUnit: 'compasso',
    barsUnit: 'compassos',
    phaseGroove: 'Groove Base',
    phaseChop: 'Execução Chop',
    phaseResolve: 'Resolução no 1',
    hint: 'Toca um groove base sobre piano elétrico Rhodes / baixo synth na velocidade real do chop antes de entrar na virada.',
  },
};

const ar: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — مدرب إيقاعات الدرامز وحركة العصي SVG واستوديو BPM',
    description:
      'تدرّب على إيقاعات الدرامز والأنماط الخطية والإيقاعات المركبة محلياً بالكامل في متصفحك عبر Web Audio ورسوم SVG المتزامنة.',
    appDescription:
      'مدرب إيقاعات درامز محلي 100% يعمل بالمتصفح مع توليد صوتي عبر Web Audio ورسوم SVG متزامنة و6 مستويات تقدمية.',
  },
  nav: {
    trainer: 'المدرب',
    library: 'المكتبة',
    custom: 'نمط مخصص',
    guide: 'الدليل',
    profilesBtn: 'الملفات والنسخ',
  },
  hero: {
    title: 'استوديو Drum Chops والفيلز الخطية',
    subtitle:
      'تدرّب على إيقاعات Drum Chops والفيلز الخطية والسداسيات مع التحكم بالسرعة وحركة العصي SVG المتزامنة ومثال موسيقي حقيقي.',
    transparentNotice:
      'مدرب إيقاعات درامز يعمل محلياً بنسبة 100% داخل المتصفح. التوليد الصوتي والرسوم المتحركة وملفات التقدم تعمل دون أي خادم أو مفتاح API.',
  },
  controls: {
    ...en.controls,
    play: 'تشغيل',
    stop: 'إيقاف',
    loop: 'تكرار',
    metronome: 'المسرع',
    soloClick: 'المسرع فقط',
    muteClick: 'كتم المسرع',
    silentKit: 'وضع الطقم الصوتي',
    silentKitHint: 'يكتم صوت الطقم ويُبقي حركة SVG والمسرع',
    volume: 'الصوت',
    bpm: 'BPM',
    speed: 'السرعة',
    bar: 'مازورة',
    step: 'خطوة',
    viewBoth: 'عرض مزدوج',
    viewKit: 'عرض الطقم',
    viewGrid: 'الشبكة الإيقاعية',
    rampTitle: 'تدرج BPM التلقائي',
    rampEnable: 'تفعيل التدرج',
    rampEvery: 'كل',
    rampBarsUnit: 'موازير',
    rampTarget: 'الهدف BPM',
    markMastered: 'تحديد كمتقن',
    mastered: 'متقن',
    createCustom: 'إنشاء نمط جديد',
  },
  levels: {
    ...en.levels,
    all: 'كل المستويات',
    custom: 'أنماطي',
    l1Title: 'المستوى 1 · الأساسيات والحركة',
    l1Desc: 'ضربات مفردة ومزدوجة موزعة بين السنير والتومز مع دعم البيس درام.',
    l2Title: 'المستوى 2 · الإيقاعات الخطية والتناوب',
    l2Desc: 'خلايا R/L/K دون تزامن الضربات مع تبديل اليد القائدة.',
    l3Title: 'المستوى 3 · السداسيات وانفجارات التومز',
    l3Desc: 'لفات سداسية وهيرتا وضربات قدم سريعة وتباين النوتات الخفية.',
    l4Title: 'المستوى 4 · تعدد الإيقاعات والأوزان الفردية',
    l4Desc: 'مجموعات الخمسة والسبعة وأوزان 5/8 و7/8 و6/8 والانتقالات الاحترافية.',
    l5Title: 'المستوى 5 · الاحتراف: الثلاثينيات والتحول الإيقاعي',
    l5Desc: 'اندفاعات 32nd وتقسيمات التسعة ووزن 11/16 والتحول من الثلاثيات للسداسيات.',
    l6Title: 'المستوى 6 · الماستر: تعدد الأوزان عبر المازورة',
    l6Desc: 'متاهات 13/16 ودورات 7 على 4 وعبارات 48 خطوة الاحترافية.',
  },
  editorial: {
    ...en.editorial,
    heading: 'كيف تتقن إيقاعات الدرامز دون توتر ودون فقدان الإيقاع',
    faqHeading: 'الأسئلة الشائعة',
    faqs: [
      {
        q: 'كيف يعمل drumchopcue دون خادم أو مفتاح API؟',
        a: 'يتم توليد جميع أصوات الإيقاع فورياً عبر Web Audio API في متصفحك، وتعمل رسوم SVG المتزامنة محلياً مع حفظ التقدم في localStorage وإمكانية التصدير بصيغة JSON.',
      },
      {
        q: 'ما الفرق بين الأساسيات والإيقاعات الخطية والتوزيع على الطقم؟',
        a: 'الأساسيات تبني مرونة اليدين، والإيقاعات الخطية تمنع تزامن ضربات الأطراف، بينما يوزع الأوركستريشن هذه الضربات موسيقياً على السنير والتومز والصنج.',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: 'وضع التدريب',
    tabRealExample: 'مثال واقعي',
    realSpeedLabel: 'السرعة الحقيقية',
    backingLabel: 'الموسيقى الخلفية',
    backingBoth: 'بيانو + سينث',
    backingAcousticPiano: 'بيانو صوتي',
    backingPiano: 'بيانو كهربائي',
    backingElectronic: 'سينث إلكتروني',
    backingOff: 'درامز فقط',
    grooveBarsLabel: 'الإيقاع الأساسي',
    barUnit: 'مازورة',
    barsUnit: 'موازير',
    phaseGroove: 'الإيقاع الأساسي',
    phaseChop: 'تنفيذ Chop',
    phaseResolve: 'الختام على 1',
    hint: 'يعزف إيقاعاً أساسياً متناغماً مع بيانو كهربائي Rhodes وباس إلكتروني بالسرعة الحقيقية قبل الدخول في الفيل.',
  },
};

const hi: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — ड्रम चॉप्स ट्रेनर, SVG स्टिकिंग और रियल-टाइम BPM स्टूडियो',
    description:
      'Web Audio परकशन, सिंक्रोनाइज़्ड SVG स्टिक एनिमेशन और ऑटो BPM रैंप के साथ ब्राउज़र में 100% लोकल ड्रम चॉप्स और लीनियर ग्रूव्स का अभ्यास करें।',
    appDescription:
      '100% क्लाइंट-साइड ड्रम चॉप्स प्रैक्टिस स्टूडियो — Web Audio सिंथेसिस, SVG एनिमेशन, 6 लेवल और JSON प्रोफाइल बैकअप के साथ।',
  },
  nav: {
    trainer: 'ट्रेनर',
    library: 'लाइब्रेरी',
    custom: 'कस्टम चॉप',
    guide: 'गाइड',
    profilesBtn: 'प्रोफाइल और JSON',
  },
  hero: {
    title: 'ड्रम चॉप्स और लीनियर फिल्स स्टूडियो',
    subtitle:
      'रियल-टाइम स्पीड कंट्रोल, सिंक्रोनाइज़्ड SVG स्टिक एनिमेशन और रियल म्यूज़िकल ग्रूव के साथ अपने ड्रम चॉप्स और लीनियर फिल्स का अभ्यास करें।',
    transparentNotice:
      '100% क्लाइंट-साइड ड्रम चॉप्स प्रैक्टिस ट्रेनर। ऑडियो सिंथेसिस, विज़ुअल एनिमेशन और लोकल प्रोफाइल बिना किसी API के सीधे आपके ब्राउज़र में चलते हैं।',
  },
  controls: {
    ...en.controls,
    play: 'चलाएं',
    stop: 'रोकें',
    loop: 'लूप',
    metronome: 'क्लिक',
    soloClick: 'सोलो क्लिक',
    muteClick: 'क्लिक म्यूट',
    silentKit: 'अकॉस्टिक किट मोड',
    volume: 'वॉल्यूम',
    speed: 'गति',
    bar: 'बार',
    step: 'स्टेप',
    viewBoth: 'दोनों दृश्य',
    viewKit: 'किट मोशन',
    viewGrid: 'रिदम ग्रिड',
    rampTitle: 'ऑटो BPM रैंप',
    rampEnable: 'रैंप चालू करें',
    markMastered: 'मास्टर्ड चुनें',
    mastered: 'मास्टर्ड',
    createCustom: 'नया कस्टम चॉप',
  },
  levels: {
    ...en.levels,
    all: 'सभी लेवल',
    custom: 'मेरे चॉप्स',
    l1Title: 'लेवल 1 · बुनियादी कौशल और मूवमेंट',
    l1Desc: 'स्नेयर और टॉम्स पर सिंगल/डबल स्ट्रोक्स और किक सपोर्टेड फिल्स।',
    l2Title: 'लेवल 2 · लीनियर ग्रूव्स और हॉकेट',
    l2Desc: 'बिना ओवरलैप वाले R/L/K पैटर्न, पैराडिडल-डिडल्स और लीड-हैंड स्विच।',
    l3Title: 'लेवल 3 · सेक्सटुपलेट्स और टॉम बर्स्ट्स',
    l3Desc: 'सिक्स-स्ट्रोक रोल्स, हर्टास, डबल किक और घोस्ट नोट कंट्रास्ट।',
    l4Title: 'लेवल 4 · पॉलीरिदम और ऑड मीटर्स',
    l4Desc: '5 और 7 के समूह, 5/8, 7/8, 6/8 और एडवांस ग्रूव-टू-चॉप ट्रांज़िशन।',
    l5Title: 'लेवल 5 · वर्चुओसो 32nd और मीट्रिक मॉड्यूलेशन',
    l5Desc: '32nd-नोट गॉस्पेल बर्स्ट्स, 9-नोट नॉनुपलेट्स, 11/16 और ट्रिपलेट-से-सेक्सटुपलेट शिफ्ट।',
    l6Title: 'लेवल 6 · मास्टर ओवर-द-बारलाइन पॉलीमेट्री',
    l6Desc: '13/16 फ्यूजन लैबिरिंथ, 7-ओवर-4 साइकिल और 48-स्टेप स्टूडियो कैडेंज़ा।',
  },
  editorial: {
    ...en.editorial,
    heading: 'बिना तनाव और ग्रूव खोए ड्रम चॉप्स में महारत कैसे हासिल करें',
    faqHeading: 'अक्सर पूछे जाने वाले प्रश्न',
    faqs: [
      {
        q: 'drumchopcue बिना सर्वर या AI API कुंजी के कैसे काम करता है?',
        a: 'सभी ड्रम ध्वनियां ब्राउज़र के Web Audio API से रीयल-टाइम में सिंथेसाइज़ होती हैं, SVG एनिमेशन लोकल चलते हैं और प्रगति JSON बैकअप के साथ localStorage में सेव होती है।',
      },
      {
        q: 'रुडीमेंट्स, लीनियर चॉप्स और ऑर्केस्ट्रेशन में क्या अंतर है?',
        a: 'रुडीमेंट्स हाथों की स्टिकिंग तैयार करते हैं, लीनियर चॉप्स एक साथ आने वाले हिट्स को अलग रखते हैं और ऑर्केस्ट्रेशन उन्हें पूरे ड्रम किट पर संगीतमय ढंग से फैलाता है।',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: 'प्रैक्टिस मोड',
    tabRealExample: 'रियल उदाहरण',
    realSpeedLabel: 'रियल स्पीड',
    backingLabel: 'बैंकिंग लूप',
    backingBoth: 'पियानो + सिंथ',
    backingAcousticPiano: 'एकॉस्टिक पियानो',
    backingPiano: 'इलेक्ट्रिक पियानो',
    backingElectronic: 'इलेक्ट्रॉनिक सिंथ',
    backingOff: 'केवल ड्रम्स',
    grooveBarsLabel: 'बेस ग्रूव',
    barUnit: 'बार',
    barsUnit: 'बार',
    phaseGroove: 'बेस ग्रूव',
    phaseChop: 'चॉप फिल',
    phaseResolve: 'बीट 1 रिजॉल्व',
    hint: 'फुल परफॉर्मेंस टेम्पो पर चॉप में जाने से पहले रोड्स इलेक्ट्रिक पियानो और सिंथ बास के साथ मैचिंग ग्रूव चलाता है।',
  },
};

const ru: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — Тренажёр Drum Chops, SVG-анимация и BPM-студия',
    description:
      'Тренируйте drum chops, линейные грувы, хокеты и полиритмию 100 % локально в браузере с синтезом Web Audio, SVG-палочками и авто-рампой BPM.',
    appDescription:
      'Полностью клиентский тренажёр ударных с синтезом Web Audio, синхронной SVG-анимацией, 6 уровнями и профилями JSON.',
  },
  nav: {
    trainer: 'Тренажёр',
    library: 'Библиотека',
    custom: 'Свой Chop',
    guide: 'Гайд',
    profilesBtn: 'Профили и JSON',
  },
  hero: {
    title: 'Студия Drum Chops и Линейных Брейков',
    subtitle:
      'Тренируйте drum chops, линейные брейки, секстоли и нечётные размеры с точной регулировкой темпа, SVG-анимацией и реальным грувом.',
    transparentNotice:
      '100 % клиентский тренажёр drum chops. Синтез звука, визуальные анимации и локальные профили работают прямо в браузере без API.',
  },
  controls: {
    ...en.controls,
    play: 'Старт',
    stop: 'Стоп',
    loop: 'Повтор',
    metronome: 'Клик',
    soloClick: 'Соло клик',
    muteClick: 'Без клика',
    silentKit: 'Режим акустической установки',
    volume: 'Громкость',
    speed: 'Скорость',
    bar: 'Такт',
    step: 'Шаг',
    viewBoth: 'Двойной вид',
    viewKit: 'Установка',
    viewGrid: 'Сетка ритма',
    rampTitle: 'Авто-рампа BPM',
    rampEnable: 'Включить рампу',
    markMastered: 'Освоено',
    mastered: 'Освоено',
    createCustom: 'Новый Chop',
  },
  levels: {
    ...en.levels,
    all: 'Все уровни',
    custom: 'Мои Chops',
    l1Title: 'Уровень 1 · База и мобильность',
    l1Desc: 'Одиночные и двойные удары по томам, акценты шестнадцатыми и брейки с бочкой.',
    l2Title: 'Уровень 2 · Линейные грувы и хокет',
    l2Desc: 'Ячейки R/L/K без совпадений, парадидл-дидлы и смена ведущей руки.',
    l3Title: 'Уровень 3 · Секстоли и взрывы по томам',
    l3Desc: 'Шестиударные роллы, херты, двойная бочка и контраст гоуст-нот.',
    l4Title: 'Уровень 4 · Полиритмия и нечётные размеры',
    l4Desc: 'Группы по 5 и 7, 5/8, 7/8, 6/8 и переходы грув → брейк.',
    l5Title: 'Уровень 5 · Виртуоз: 32-е и метрическая модуляция',
    l5Desc: 'Госпел-взрывы 32-ми, ноноли (9), размер 11/16 и переход триоли → секстоли.',
    l6Title: 'Уровень 6 · Мастер: полиметрия через тактовую черту',
    l6Desc: 'Фьюжн 13/16, циклы 7 на 4, 9-нотные фразы через такт и каденции на 48 шагов.',
  },
  editorial: {
    ...en.editorial,
    heading: 'Как отрабатывать Drum Chops без зажимов и потери грува',
    faqHeading: 'Частые вопросы',
    faqs: [
      {
        q: 'Как drumchopcue работает без сервера и API-ключа?',
        a: 'Звуки ударных синтезируются в реальном времени через Web Audio API, SVG-анимация синхронизируется локально, а прогресс сохраняется в localStorage с экспортом в JSON.',
      },
      {
        q: 'В чём разница между рудиментами, линейными сбивками и оркестровкой?',
        a: 'Рудименты развивают технику рук, линейные сбивки исключают одновременные удары конечностей, а оркестровка распределяет акценты по малым, томам, бочке и тарелкам.',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: 'Режим практики',
    tabRealExample: 'Реальный пример',
    realSpeedLabel: 'Реальный темп',
    backingLabel: 'Аккомпанемент',
    backingBoth: 'Пиано + Синт',
    backingAcousticPiano: 'Акуст. пиано',
    backingPiano: 'Электропиано',
    backingElectronic: 'Электро-синт',
    backingOff: 'Только ударные',
    grooveBarsLabel: 'Базовый грув',
    barUnit: 'такт',
    barsUnit: 'такта',
    phaseGroove: 'Базовый грув',
    phaseChop: 'Брейк Chop',
    phaseResolve: 'Акцент на 1',
    hint: 'Запускает базовый грув с электропиано Rhodes и синтезаторным басом в оригинальном темпе перед входом в брейк.',
  },
};

const zh: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — 爵士鼓 Chops 训练器、SVG 鼓棒动画与实时 BPM 练习室',
    description:
      '完全在浏览器本地运行的爵士鼓 Chops 与线性节奏训练器，搭载 Web Audio 打击乐合成、同步 SVG 鼓棒动画与自动 BPM 渐进加速。',
    appDescription:
      '100% 客户端运行的爵士鼓 Chops 训练工作室，支持 Web Audio 合成、SVG 动画、6 个进阶等级与本地 JSON 档案。',
  },
  nav: {
    trainer: '训练器',
    library: '曲库',
    custom: '自定义 Chop',
    guide: '练习指南',
    profilesBtn: '档案与备份',
  },
  hero: {
    title: 'Drum Chops 与线性加花练习室',
    subtitle:
      '配合实时速度调节、同步 SVG 鼓棒动画与真实伴奏律动，系统训练你的 Drum Chops、线性加花、六连音与奇数拍。',
    transparentNotice:
      '100% 客户端本地运行的鼓手 Chops 训练器。音频合成、视觉动画与本地进度档案均直接在浏览器中运行，零 API 消耗。',
  },
  controls: {
    ...en.controls,
    play: '播放',
    stop: '停止',
    loop: '循环',
    metronome: '节拍器',
    soloClick: '仅节拍器',
    muteClick: '静音节拍器',
    silentKit: '真鼓静音模式',
    volume: '音量',
    speed: '倍速',
    bar: '小节',
    step: '步进',
    viewBoth: '双视图',
    viewKit: '鼓组动画',
    viewGrid: '节奏网格',
    rampTitle: '自动 BPM 爬坡',
    rampEnable: '启用渐进加速',
    markMastered: '标记已掌握',
    mastered: '已掌握',
    createCustom: '新建 Chop',
  },
  levels: {
    ...en.levels,
    all: '全部等级',
    custom: '我的 Chops',
    l1Title: '等级 1 · 基础与移动',
    l1Desc: '军鼓与嗵鼓间的单击/双击移动、十六分音符重音与底鼓衔接加花。',
    l2Title: '等级 2 · 线性律动与交错',
    l2Desc: '无同时击打的 R/L/K 线性组合、复合跳击编配与引导手切换。',
    l3Title: '等级 3 · 六连音与嗵鼓爆发',
    l3Desc: '六连音滚奏、Herta 爆发、快速双底鼓组合及鬼音动态对比。',
    l4Title: '等级 4 · 复节奏与奇数拍',
    l4Desc: '五连音与七连音分组、5/8、7/8、6/8 复合律动及过渡衔接。',
    l5Title: '等级 5 · 演奏级三十二分音符与节拍转换',
    l5Desc: '三十二分音符 Gospel 爆发、九连音、11/16 奇数拍与三连音转六连音。',
    l6Title: '等级 6 · 大师级跨小节复节拍炫技',
    l6Desc: '13/16 融合迷宫、4 拍内 7 连音循环、跨小节 9 音型及 48 步华彩独奏。',
  },
  editorial: {
    ...en.editorial,
    heading: '如何在保持松弛与律动的同时掌握 Drum Chops',
    faqHeading: '常见问题',
    faqs: [
      {
        q: 'drumchopcue 如何在没有服务器或 AI API 密钥的情况下运行？',
        a: '所有鼓声均通过浏览器内置 Web Audio API 实时合成，SVG 动画在本地同步驱动，练习进度保存在 localStorage 中并支持 JSON 导出备份。',
      },
      {
        q: '基本功、线性 Chops 与鼓组编配有什么区别？',
        a: '基本功训练双手手法与反弹，线性 Chops 避免四肢同时击打以保证清晰度，编配则将这些手法音乐化地分布到军鼓、嗵鼓、底鼓和镲片上。',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: '练习模式',
    tabRealExample: '实战示例',
    realSpeedLabel: '原速实战',
    backingLabel: '背景伴奏',
    backingBoth: '电钢 + 合成器',
    backingAcousticPiano: '原声钢琴',
    backingPiano: 'Rhodes 电钢',
    backingElectronic: '电子合成器',
    backingOff: '仅鼓组',
    grooveBarsLabel: '基础律动',
    barUnit: '小节',
    barsUnit: '小节',
    phaseGroove: '基础律动',
    phaseChop: 'Chop 加花',
    phaseResolve: '第一拍收尾',
    hint: '在进入加花前，以实战原速在 Rhodes 电钢琴与电子合成器贝斯伴奏下循环演奏匹配的基础律动。',
  },
};

const ja: TranslationBundle = {
  ...en,
  seo: {
    title: 'drumchopcue — ドラム Chops トレーナー・SVG スティックアニメ＆BPM スタジオ',
    description:
      'Web Audio パーカッション合成、同期 SVG スティックアニメーション、自動 BPM ランプを備えた 100% ブラウザ完結型ドラム Chops 練習スタジオ。',
    appDescription:
      '100% クライアントサイドで動作するドラム Chops 練習スタジオ。Web Audio 合成、SVG アニメ、6段階レベル、JSON バックアップ対応。',
  },
  nav: {
    trainer: 'トレーナー',
    library: 'ライブラリ',
    custom: 'カスタム作成',
    guide: '練習ガイド',
    profilesBtn: 'プロファイル',
  },
  hero: {
    title: 'ドラム Chops＆リニアフィル・スタジオ',
    subtitle:
      'リアルタイムの速度調整、同期 SVG スティック、実戦バッキングループで、ドラム Chops やリニアフィルを直感的に習得。',
    transparentNotice:
      '100% クライアントサイドで動作するドラム Chops トレーナー。音声合成、アニメーション、ローカル進捗は API 通信なしでブラウザ上で完結します。',
  },
  controls: {
    ...en.controls,
    play: '再生',
    stop: '停止',
    loop: 'ループ',
    metronome: 'クリック',
    soloClick: 'クリックのみ',
    muteClick: 'クリック消音',
    silentKit: '生ドラム練習モード',
    volume: '音量',
    speed: '速度',
    bar: '小節',
    step: 'ステップ',
    viewBoth: '分割表示',
    viewKit: 'キット表示',
    viewGrid: 'リズム譜',
    rampTitle: '自動 BPM ランプ',
    rampEnable: 'ランプ有効',
    markMastered: '習得済みにする',
    mastered: '習得済み',
    createCustom: '新規 Chop 作成',
  },
  levels: {
    ...en.levels,
    all: '全レベル',
    custom: 'マイ Chop',
    l1Title: 'レベル 1 · 基礎とキット移動',
    l1Desc: 'シングル/ダブルのタム移動、16分アクセント、キック絡みの基本フィル。',
    l2Title: 'レベル 2 · リニア＆ホケット',
    l2Desc: '同時打音なしの手足コンビネーション、パラディドル・ディドル、リードハンド切替。',
    l3Title: 'レベル 3 · 6連符＆タムエクスプロージョン',
    l3Desc: 'シックスストロークロール、ハータ、ダブルキック連打、ゴーストノート対比。',
    l4Title: 'レベル 4 · ポリリズム＆変拍子',
    l4Desc: '5連/7連グループ、5/8・7/8・6/8 変拍子とグルーヴからの高度な移行。',
    l5Title: 'レベル 5 · 超絶32分＆メトリック・モジュレーション',
    l5Desc: '32分ゴスペル・バースト、9連符、11/16変拍子、3連から6連へのギアチェンジ。',
    l6Title: 'レベル 6 · マスター・小節跨ぎポリメトリック',
    l6Desc: '13/16フュージョン、7-over-4サイクル、小節跨ぎ9音型＆48ステップ・カデンツァ。',
  },
  editorial: {
    ...en.editorial,
    heading: '力みをなくしグルーヴを保ったままドラム Chops を習得する方法',
    faqHeading: 'よくある質問',
    faqs: [
      {
        q: 'drumchopcue はどのようにサーバーや API キーなしで動作しますか？',
        a: 'すべてのドラム音はブラウザの Web Audio API でリアルタイム合成され、SVG アニメーションもローカルで同期し、進捗は JSON エクスポート対応の localStorage に保存されます。',
      },
      {
        q: 'ルーディメンツ、リニア Chops、オーケストレーションの違いは何ですか？',
        a: 'ルーディメンツは基礎的な手順、リニア Chops は手足の同時打音を排した分離表現、オーケストレーションはそれらをスネア・タム・キック・シンバルへ音楽的に配置する技術です。',
      },
    ],
  },
  realExample: {
    ...en.realExample,
    tabTrainer: '練習モード',
    tabRealExample: '実戦例',
    realSpeedLabel: '実戦テンポ',
    backingLabel: 'バッキング',
    backingBoth: 'ピアノ + シンセ',
    backingAcousticPiano: '生ピアノ',
    backingPiano: 'エレピ',
    backingElectronic: '電子シンセ',
    backingOff: 'ドラムのみ',
    grooveBarsLabel: 'ベースグルーヴ',
    phaseGroove: '基本グルーヴ',
    phaseChop: 'Chop フィル',
    phaseResolve: '1拍目解決',
  },
};

export const TRANSLATIONS: Record<SupportedLang, TranslationBundle> = {
  en,
  es,
  fr,
  de,
  pt,
  ar,
  hi,
  ru,
  zh,
  ja,
};
