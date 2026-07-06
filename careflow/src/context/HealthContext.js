import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_MEDICATIONS, MOCK_SURGERIES, MOCK_REPORTS,
  MOCK_APPOINTMENTS, MOCK_HISTORY,
} from '../services/mockService';

const HealthContext = createContext(null);

export function HealthProvider({ children }) {
  const [medications, setMedications] = useState(MOCK_MEDICATIONS);
  const [surgeries, setSurgeries] = useState(MOCK_SURGERIES);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const history = MOCK_HISTORY; // read-only mock

  /* ── Medications ── */
  const addMedication = (med) => setMedications(m => [...m, { ...med, id: Date.now() }]);
  const updateMedication = (id, fields) =>
    setMedications(m => m.map(x => x.id === id ? { ...x, ...fields } : x));
  const deleteMedication = (id) => setMedications(m => m.filter(x => x.id !== id));

  /* ── Surgeries ── */
  const addSurgery = (surg) => setSurgeries(s => [...s, { ...surg, id: Date.now() }]);
  const updateSurgery = (id, fields) =>
    setSurgeries(s => s.map(x => x.id === id ? { ...x, ...fields } : x));
  const deleteSurgery = (id) => setSurgeries(s => s.filter(x => x.id !== id));

  /* ── Reports ── */
  const addReport = (rep) => setReports(r => [...r, { ...rep, id: Date.now() }]);
  const deleteReport = (id) => setReports(r => r.filter(x => x.id !== id));

  /* ── Appointments ── */
  const addAppointment = (appt) => setAppointments(a => [...a, { ...appt, id: Date.now() }]);

  return (
    <HealthContext.Provider value={{
      medications, addMedication, updateMedication, deleteMedication,
      surgeries, addSurgery, updateSurgery, deleteSurgery,
      reports, addReport, deleteReport,
      appointments, addAppointment,
      history,
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error('useHealth must be inside HealthProvider');
  return ctx;
}
