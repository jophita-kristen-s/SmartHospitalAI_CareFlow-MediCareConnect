import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, logoutUser, signupUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const userData = await loginUser(credentials);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.message || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (details) => {
    setError(null);
    setLoading(true);
    try {
      const userData = await signupUser(details);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.message || 'Signup failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: !!user,
    isDoctor: user?.role === 'doctor',
    isAdmin: user?.role === 'admin',
    isNurse: user?.role === 'nurse',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;