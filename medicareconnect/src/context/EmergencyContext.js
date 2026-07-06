import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  fetchEmergencyCases,
  fetchAlerts,
  fetchEmergencyStats,
  acceptEmergencyCase,
  rejectEmergencyCase,
  resolveAlert as resolveAlertRequest,
  createEmergencyCase,
} from '../services/emergencyService';

const EmergencyContext = createContext(null);

export function EmergencyProvider({ children }) {
  const [cases, setCases] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ waiting: 0, accepted: 0, critical: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshEmergency = useCallback(async () => {
    try {
      const [caseList, alertList, statBlock] = await Promise.all([
        fetchEmergencyCases('all'),
        fetchAlerts(),
        fetchEmergencyStats(),
      ]);
      setCases(caseList);
      setAlerts(alertList);
      setStats(statBlock);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load emergency data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEmergency();
    const interval = setInterval(refreshEmergency, 15000);
    return () => clearInterval(interval);
  }, [refreshEmergency]);

  const acceptCase = useCallback(
    async (id, doctorName = 'Duty Doctor') => {
      await acceptEmergencyCase(id, doctorName);
      await refreshEmergency();
    },
    [refreshEmergency]
  );

  const rejectCase = useCallback(
    async (id, reason = '') => {
      await rejectEmergencyCase(id, reason);
      await refreshEmergency();
    },
    [refreshEmergency]
  );

  const resolveAlert = useCallback(
    async (id) => {
      await resolveAlertRequest(id);
      await refreshEmergency();
    },
    [refreshEmergency]
  );

  const simulateIncomingCase = useCallback(async () => {
    await createEmergencyCase();
    await refreshEmergency();
  }, [refreshEmergency]);

  return (
    <EmergencyContext.Provider
      value={{
        cases,
        alerts,
        stats,
        loading,
        error,
        liveCount: stats.alerts,
        acceptCase,
        rejectCase,
        resolveAlert,
        refreshEmergency,
        simulateIncomingCase,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergency must be used within EmergencyProvider');
  return ctx;
}

export default EmergencyContext;
