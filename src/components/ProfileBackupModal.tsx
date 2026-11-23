import { useRef, useState } from 'react';
import { Download, Trash2, Upload, UserPlus, X } from 'lucide-react';
import type { ProfileStore } from '../types/drum';
import type { TranslationBundle } from '../i18n/translations';

interface ProfileBackupModalProps {
  store: ProfileStore;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onExportJson: () => void;
  onImportJson: (jsonText: string) => boolean;
  onClose: () => void;
  t: TranslationBundle;
}

function formatPracticeTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${String(remMins).padStart(2, '0')}m`;
  }
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

export function ProfileBackupModal({
  store,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onExportJson,
  onImportJson,
  onClose,
  t,
}: ProfileBackupModalProps) {
  const [newName, setNewName] = useState('');
  const [statusMsg, setStatusMsg] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeProfile =
    store.profiles.find((p) => p.id === store.activeProfileId) ??
    store.profiles[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreateProfile(trimmed);
    setNewName('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImportJson(String(reader.result || ''));
      setStatusMsg(
        ok
          ? { type: 'ok', text: t.profile.importSuccess }
          : { type: 'err', text: t.profile.importError }
      );
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{t.profile.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.profile.close}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Profile Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-slate-200 rounded-xl p-3 bg-[#F8FAFC]">
            <div className="text-xs text-slate-500">{t.profile.streakLabel}</div>
            <div className="font-mono-tabular text-xl font-bold text-slate-900 mt-1">
              {activeProfile.streakDays} {t.profile.daysUnit}
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 bg-[#F8FAFC]">
            <div className="text-xs text-slate-500">
              {t.profile.practiceTimeLabel}
            </div>
            <div className="font-mono-tabular text-xl font-bold text-slate-900 mt-1">
              {formatPracticeTime(activeProfile.totalPracticeSeconds)}
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 bg-[#F8FAFC]">
            <div className="text-xs text-slate-500">
              {t.profile.practicedCountLabel}
            </div>
            <div className="font-mono-tabular text-xl font-bold text-slate-900 mt-1">
              {activeProfile.practicedChopIds.length}
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 bg-[#F8FAFC]">
            <div className="text-xs text-slate-500">
              {t.profile.masteredCountLabel}
            </div>
            <div className="font-mono-tabular text-xl font-bold text-emerald-700 mt-1">
              {activeProfile.masteredChopIds.length}
            </div>
          </div>
        </div>

        {/* Profile Selector List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700">
            {t.profile.activeProfile}
          </p>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {store.profiles.map((prof) => {
              const isActive = prof.id === activeProfile.id;
              return (
                <div
                  key={prof.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3 ${
                    isActive ? 'bg-amber-50/70' : 'bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectProfile(prof.id)}
                    className="flex-1 text-start"
                  >
                    <div className="text-sm font-semibold text-slate-900">
                      {prof.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono-tabular">
                      {prof.masteredChopIds.length} {t.profile.masteredCountLabel} ·{' '}
                      {prof.customChops.length} {t.levels.custom}
                    </div>
                  </button>

                  {store.profiles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteProfile(prof.id)}
                      aria-label={t.profile.deleteBtn}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Create New Profile */}
        <form onSubmit={handleCreate} className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t.profile.newProfilePlaceholder}
            className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.profile.createBtn}</span>
          </button>
        </form>

        {/* Export / Import JSON */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D97706] hover:bg-amber-700 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>{t.profile.exportJson}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              <Upload className="w-4 h-4" />
              <span>{t.profile.importJson}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {statusMsg && (
            <span
              className={`text-xs font-medium ${
                statusMsg.type === 'ok' ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {statusMsg.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
