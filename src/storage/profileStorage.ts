import type { ChopPattern, DrumProfile, ProfileStore } from '../types/drum';

const STORAGE_KEY = 'chopcue_profiles_v1';

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterdayDateString(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultProfile(name = 'Studio Drummer'): DrumProfile {
  return {
    id: `prof-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    createdAt: new Date().toISOString(),
    practicedChopIds: [],
    masteredChopIds: [],
    bestBpmByChop: {},
    totalPracticeSeconds: 0,
    streakDays: 0,
    lastPracticeDate: null,
    customChops: [],
  };
}

export function loadProfileStore(): ProfileStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProfileStore;
      if (
        parsed &&
        parsed.version === 1 &&
        Array.isArray(parsed.profiles) &&
        parsed.profiles.length > 0
      ) {
        return parsed;
      }
    }
  } catch {
    // Fallback to clean default profile if storage is corrupted
  }
  const initial = createDefaultProfile('Default Kit');
  return {
    version: 1,
    activeProfileId: initial.id,
    profiles: [initial],
  };
}

export function saveProfileStore(store: ProfileStore): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function updateStreakAndSeconds(
  profile: DrumProfile,
  addedSeconds: number
): DrumProfile {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  let streakDays = profile.streakDays;

  if (profile.lastPracticeDate === today) {
    // Already logged today
  } else if (profile.lastPracticeDate === yesterday) {
    streakDays = Math.max(1, streakDays + 1);
  } else {
    streakDays = 1;
  }

  return {
    ...profile,
    totalPracticeSeconds: profile.totalPracticeSeconds + addedSeconds,
    streakDays,
    lastPracticeDate: today,
  };
}

export function recordChopPractice(
  profile: DrumProfile,
  chopId: string,
  effectiveBpm: number
): DrumProfile {
  const practicedSet = new Set(profile.practicedChopIds);
  practicedSet.add(chopId);
  const prevBest = profile.bestBpmByChop[chopId] ?? 0;
  const roundedBpm = Math.round(effectiveBpm);

  return {
    ...profile,
    practicedChopIds: Array.from(practicedSet),
    bestBpmByChop: {
      ...profile.bestBpmByChop,
      [chopId]: Math.max(prevBest, roundedBpm),
    },
  };
}

export function toggleMasteredChop(
  profile: DrumProfile,
  chopId: string
): DrumProfile {
  const mastered = new Set(profile.masteredChopIds);
  if (mastered.has(chopId)) {
    mastered.delete(chopId);
  } else {
    mastered.add(chopId);
  }
  const practiced = new Set(profile.practicedChopIds);
  practiced.add(chopId);

  return {
    ...profile,
    practicedChopIds: Array.from(practiced),
    masteredChopIds: Array.from(mastered),
  };
}

export function upsertCustomChop(
  profile: DrumProfile,
  chop: ChopPattern
): DrumProfile {
  const existingIdx = profile.customChops.findIndex((c) => c.id === chop.id);
  const nextCustom = [...profile.customChops];
  if (existingIdx >= 0) {
    nextCustom[existingIdx] = chop;
  } else {
    nextCustom.unshift(chop);
  }
  return {
    ...profile,
    customChops: nextCustom,
  };
}

export function deleteCustomChop(
  profile: DrumProfile,
  chopId: string
): DrumProfile {
  return {
    ...profile,
    customChops: profile.customChops.filter((c) => c.id !== chopId),
  };
}

export function exportProfileStoreJson(store: ProfileStore): string {
  return JSON.stringify(store, null, 2);
}

export function parseImportedProfileStore(jsonText: string): ProfileStore | null {
  try {
    const data = JSON.parse(jsonText) as Partial<ProfileStore>;
    if (!data || data.version !== 1 || !Array.isArray(data.profiles)) {
      return null;
    }
    const validProfiles: DrumProfile[] = data.profiles
      .filter(
        (p): p is DrumProfile =>
          Boolean(p) &&
          typeof p.id === 'string' &&
          typeof p.name === 'string' &&
          Array.isArray(p.practicedChopIds) &&
          Array.isArray(p.masteredChopIds) &&
          typeof p.bestBpmByChop === 'object'
      )
      .map((p) => ({
        ...p,
        customChops: Array.isArray(p.customChops) ? p.customChops : [],
        totalPracticeSeconds:
          typeof p.totalPracticeSeconds === 'number' ? p.totalPracticeSeconds : 0,
        streakDays: typeof p.streakDays === 'number' ? p.streakDays : 0,
        lastPracticeDate:
          typeof p.lastPracticeDate === 'string' ? p.lastPracticeDate : null,
      }));

    if (validProfiles.length === 0) return null;
    const activeId = validProfiles.some((p) => p.id === data.activeProfileId)
      ? (data.activeProfileId as string)
      : validProfiles[0].id;

    return {
      version: 1,
      activeProfileId: activeId,
      profiles: validProfiles,
    };
  } catch {
    return null;
  }
}
