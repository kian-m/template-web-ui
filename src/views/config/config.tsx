'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  getSobrietyStreaks,
  getTrackerConfig,
  saveSobrietyStreaks,
  saveTrackerConfig,
  toDateKey,
} from '../../utils/tracker-storage';
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

  useEffect(() => {
    setConfig(getTrackerConfig());
    setStreaks(getSobrietyStreaks());
  }, []);

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
      </section>

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
    </div>
  );
};

export default Config;
