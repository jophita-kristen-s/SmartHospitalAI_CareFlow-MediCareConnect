import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USER } from '../services/mockService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Pre-load from sessionStorage so page refreshes keep the user logged in
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('cf_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [authError, setAuthError] = useState('');

  const login = useCallback((email, password) => {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      setUser(MOCK_USER);
      sessionStorage.setItem('cf_user', JSON.stringify(MOCK_USER));
      setAuthError('');
      return true;
    }
    setAuthError('Invalid email or password. Try: gopika@careflow.in / Care@123');
    return false;
  }, []);

  const signup = useCallback((name, email, password) => {
    // In a real app this would call an API.
    // For the mock we just store a derived user.
    const newUser = { ...MOCK_USER, name, email, password };
    setUser(newUser);
    sessionStorage.setItem('cf_user', JSON.stringify(newUser));
    setAuthError('');
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('cf_user');
  }, []);

  const updateUser = useCallback((fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      sessionStorage.setItem('cf_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
