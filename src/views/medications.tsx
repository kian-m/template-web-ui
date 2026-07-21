'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPills } from '@fortawesome/free-solid-svg-icons';
import { captureEvent } from '../utils/analytics';
import {
  getMedicationLogForDate,
  getPrescriptions,
  setMedicationTaken,
  toDateKey,
} from '../utils/tracker-storage';
import type { MedicationLogEntry, Prescription } from '../types/trackers';

const Medications: React.FC = () => {
  const [today, setToday] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [takenById, setTakenById] = useState<MedicationLogEntry>({});

  const reload = (date = toDateKey(new Date())) => {
    setToday(date);
    setPrescriptions(getPrescriptions());
    setTakenById(getMedicationLogForDate(date));
  };

  useEffect(() => {
    reload();
  }, []);

  const toggleTaken = (prescription: Prescription) => {
    const taken = !takenById[prescription.id];
    setMedicationTaken(today, prescription.id, taken);
    setTakenById((current) => ({ ...current, [prescription.id]: taken }));
    captureEvent('medication_taken_toggled', {
      prescription_id: prescription.id,
      date: today,
      taken,
    });
  };

  const completed = prescriptions.filter((p) => takenById[p.id]).length;

  return (
    <div className="medications-view">
      <h2 className="overlay-title">Today&apos;s medication</h2>
      {prescriptions.length === 0 ? (
        <p className="overlay-empty">
          No prescriptions yet. Add one in config to start tracking daily doses.
        </p>
      ) : (
        <>
          <p className="config-hint">
            Resets each day. Mark each prescription once you&apos;ve taken it.
          </p>
          <div className="med-progress" aria-live="polite">
            {completed} of {prescriptions.length} taken today
          </div>
          <div className="med-list">
            {prescriptions.map((prescription) => {
              const taken = Boolean(takenById[prescription.id]);
              return (
                <button
                  key={prescription.id}
                  type="button"
                  className={`med-card ${taken ? 'taken' : ''}`}
                  onClick={() => toggleTaken(prescription)}
                  aria-pressed={taken}
                  aria-label={`${prescription.label} ${taken ? 'taken' : 'not taken'}`}
                >
                  <span className="med-icon">
                    <FontAwesomeIcon icon={taken ? faCheck : faPills} />
                  </span>
                  <span className="med-name">{prescription.label}</span>
                  <span className="med-status">
                    {taken ? 'Taken' : 'Not yet'}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Medications;
