import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  fetchPatients,
  fetchPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
} from '../services/patientService';

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', ward: 'all' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  const loadPatients = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPatients({ ...filters, ...params });
      setPatients(result.patients || result);
      if (result.total !== undefined) {
        setPagination(prev => ({ ...prev, total: result.total }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const getPatient = useCallback(async (id) => {
    setLoading(true);
    try {
      const patient = await fetchPatientById(id);
      setSelectedPatient(patient);
      return patient;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPatient = useCallback(async (data) => {
    setLoading(true);
    try {
      const newPatient = await createPatient(data);
      setPatients(prev => [newPatient, ...prev]);
      return { success: true, patient: newPatient };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const editPatient = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const updated = await updatePatient(id, data);
      setPatients(prev => prev.map(p => (p.id === id ? updated : p)));
      if (selectedPatient?.id === id) setSelectedPatient(updated);
      return { success: true, patient: updated };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [selectedPatient]);

  const removePatient = useCallback(async (id) => {
    setLoading(true);
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query) => {
    if (!query.trim()) { setSearchResults([]); return; }
    try {
      const results = await searchPatients(query);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Derived stats
  const stats = {
    total: patients.length,
    admitted: patients.filter(p => p.status === 'admitted').length,
    discharged: patients.filter(p => p.status === 'discharged').length,
    critical: patients.filter(p => p.priority === 'critical').length,
  };

  const value = {
    patients,
    selectedPatient,
    loading,
    error,
    searchResults,
    filters,
    pagination,
    stats,
    setFilters,
    setPagination,
    loadPatients,
    getPatient,
    addPatient,
    editPatient,
    removePatient,
    search,
    clearError,
    setSelectedPatient,
  };

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatients() {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatients must be used within PatientProvider');
  return ctx;
}

export default PatientContext;