'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  clearTrackerData,
  getSobrietyStreaks,
  getTrackerConfig,
  saveSobrietyStreaks,
  saveTrackerConfig,
  toDateKey,
  type ResetSection,
} from '../../utils/tracker-storage';
import { encryptLocalStorage, decryptLocalStorage } from '../../utils/session';
import { trackerIcon } from '../../utils/tracker-icons';
import type { SobrietyStreak, TrackerConfig } from '../../types/trackers';

interface ConfigProps {
  /** Notified whenever config or streaks change, so the main page can refresh. */
  onChanged?: () => void;
}

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className={`toggle ${checked ? 'on' : ''}`}
    onClick={() => onChange(!checked)}
  >
    <span className="toggle-knob" />
  </button>
);

const Config: React.FC<ConfigProps> = ({ onChanged }) => {
  const [config, setConfig] = useState<TrackerConfig | null>(null);
  const [streaks, setStreaks] = useState<SobrietyStreak[]>([]);
  const [exported, setExported] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [importError, setImportError] = useState(false);

  useEffect(() => {
    setConfig(getTrackerConfig());
    setStreaks(getSobrietyStreaks());
  }, []);

  const handleExport = async () => {
    await encryptLocalStorage();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const handleImport = () => {
    if (decryptLocalStorage(importValue.trim())) {
      setImportValue('');
      window.location.reload(); // pick up restored data everywhere
    } else {
      setImportError(true);
      setTimeout(() => setImportError(false), 2500);
    }
  };

  const resetSection = (section: ResetSection, label: string) => {
    if (!window.confirm(`Reset ${label}? This can’t be undone.`)) return;
    clearTrackerData(section);
    setStreaks(getSobrietyStreaks());
    onChanged?.();
  };

  if (!config) return null;

  const persistConfig = (next: TrackerConfig) => {
    setConfig(next);
    saveTrackerConfig(next);
    onChanged?.();
  };

  const persistStreaks = (next: SobrietyStreak[]) => {
    setStreaks(next);
    saveSobrietyStreaks(next);
    onChanged?.();
  };

  const updateDaily = (key: string, patch: Partial<{ enabled: boolean; label: string }>) => {
    persistConfig({
      ...config,
      daily: { ...config.daily, [key]: { ...config.daily[key], ...patch } },
    });
  };

  const addStreak = () => {
    persistStreaks([
      ...streaks,
      {
        id: `s_${Date.now()}`,
        label: 'Sober from…',
        startDate: toDateKey(new Date()),
      },
    ]);
  };

  const updateStreak = (id: string, patch: Partial<SobrietyStreak>) =>
    persistStreaks(streaks.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const removeStreak = (id: string) =>
    persistStreaks(streaks.filter((s) => s.id !== id));

  return (
    <div className="config-view">
      <h2 className="overlay-title">Configure trackers</h2>

      <section className="config-section">
        <h3>Daily trackers</h3>
        <p className="config-hint">Shown on each calendar day.</p>
        {Object.keys(config.daily).map((key) => {
          const cfg = config.daily[key];
          return (
            <div key={key} className="config-row">
              <FontAwesomeIcon icon={trackerIcon(cfg.icon)} className="config-row-icon" />
              <input
                className="config-input"
                value={cfg.label}
                onChange={(e) => updateDaily(key, { label: e.target.value })}
                aria-label={`${key} label`}
              />
              <Toggle
                checked={cfg.enabled}
                onChange={(enabled) => updateDaily(key, { enabled })}
                label={`Enable ${cfg.label}`}
              />
            </div>
          );
        })}
      </section>

      <section className="config-section">
        <h3>Extra trackers</h3>
        <div className="config-row">
          <span className="config-row-label">Sobriety counter</span>
          <Toggle
            checked={config.sobriety.enabled}
            onChange={(enabled) =>
              persistConfig({ ...config, sobriety: { enabled } })
            }
            label="Enable sobriety counter"
          />
        </div>
        <div className="config-row">
          <span className="config-row-label">Symptom diary (body map)</span>
          <Toggle
            checked={config.symptoms.enabled}
            onChange={(enabled) =>
              persistConfig({ ...config, symptoms: { enabled } })
            }
            label="Enable symptom diary"
          />
        </div>
        <div className="config-row">
          <span className="config-row-label">Cycle tracking</span>
          <Toggle
            checked={config.cycle.enabled}
            onChange={(enabled) =>
              persistConfig({ ...config, cycle: { ...config.cycle, enabled } })
            }
            label="Enable cycle tracking"
          />
        </div>
      </section>

      {config.cycle.enabled && (
        <section className="config-section">
          <h3>Cycle phases</h3>
          <p className="config-hint">Which phases to outline on the calendar.</p>
          {(
            [
              ['menstrual', 'Menstrual'],
              ['follicular', 'Follicular'],
              ['ovulation', 'Ovulation'],
              ['luteal', 'Luteal'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="config-row">
              <span className={`cyc-legend ${key}`} />
              <span className="config-row-label">{label}</span>
              <Toggle
                checked={config.cycle.phases[key]}
                onChange={(on) =>
                  persistConfig({
                    ...config,
                    cycle: {
                      ...config.cycle,
                      phases: { ...config.cycle.phases, [key]: on },
                    },
                  })
                }
                label={`Show ${label} phase`}
              />
            </div>
          ))}
        </section>
      )}

      {config.sobriety.enabled && (
        <section className="config-section">
          <h3>Sobriety streaks</h3>
          {streaks.map((streak) => (
            <div key={streak.id} className="config-row">
              <input
                className="config-input"
                value={streak.label}
                onChange={(e) => updateStreak(streak.id, { label: e.target.value })}
                aria-label="Streak label"
              />
              <input
                className="config-date"
                type="date"
                value={streak.startDate}
                onChange={(e) =>
                  updateStreak(streak.id, { startDate: e.target.value })
                }
                aria-label="Streak start date"
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => removeStreak(streak.id)}
                aria-label="Remove streak"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <button type="button" className="link-button" onClick={addStreak}>
            <FontAwesomeIcon icon={faPlus} /> Add streak
          </button>
        </section>
      )}

      <section className="config-section">
        <h3>Backup &amp; restore</h3>
        <p className="config-hint">
          Export copies an encrypted backup to your clipboard. Paste one to
          restore.
        </p>
        <button type="button" className="cycle-btn" onClick={handleExport}>
          {exported ? '✓ Copied to clipboard' : 'Export data'}
        </button>
        <div className="config-row" style={{ marginTop: '0.6rem' }}>
          <input
            className="config-input"
            placeholder="Paste backup here"
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            aria-label="Backup to import"
          />
          <button
            type="button"
            className="cycle-btn"
            onClick={handleImport}
            disabled={!importValue.trim()}
          >
            Import
          </button>
        </div>
        {importError && (
          <p className="config-hint" style={{ color: '#ff8a8a' }}>
            Couldn’t read that backup.
          </p>
        )}
      </section>

      <section className="config-section">
        <h3>Reset data</h3>
        <p className="config-hint">Clears logged data. Your settings stay.</p>
        <div className="reset-actions">
          <button
            type="button"
            className="reset-btn"
            onClick={() => resetSection('daily', 'daily ratings')}
          >
            Reset daily ratings
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={() => resetSection('sobriety', 'sobriety streaks')}
          >
            Reset sobriety
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={() => resetSection('symptoms', 'symptom history')}
          >
            Reset symptoms
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={() => resetSection('cycles', 'cycle history')}
          >
            Reset cycle data
          </button>
          <button
            type="button"
            className="reset-btn danger"
            onClick={() => resetSection('all', 'ALL tracked data')}
          >
            Reset everything
          </button>
        </div>
      </section>
    </div>
  );
};

export default Config;
