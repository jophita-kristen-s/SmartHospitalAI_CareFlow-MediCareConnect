import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  container: { width: '100%', maxWidth: '440px' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' },
  logoIcon: {
    width: 44,
    height: 44,
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
    color: '#fff',
    fontWeight: 800,
  },
  logoText: { fontSize: 22, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' },
  logoSpan: { color: '#3b82f6' },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 8px 40px rgba(59,130,246,0.12)',
  },
  title: { fontSize: 26, fontWeight: 800, color: '#1e293b', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 28 },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 20,
  },
  formGroup: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  rememberLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', cursor: 'pointer' },
  forgotLink: { fontSize: 13, color: '#3b82f6', fontWeight: 600, textDecoration: 'none' },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s',
  },
  demoCard: {
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 24,
  },
  demoTitle: { fontSize: 12, fontWeight: 700, color: '#0369a1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' },
  demoItem: { fontSize: 12, color: '#0c4a6e', marginBottom: 2, fontFamily: 'monospace' },
  footer: { textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 },
  footerLink: { color: '#3b82f6', fontWeight: 600, textDecoration: 'none' },
};

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    const result = await login({ email: form.email, password: form.password });
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>+</div>
          <div style={styles.logoText}>
            <span style={styles.logoSpan}>{APP_NAME}</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.title}>Welcome back</div>
          <div style={styles.subtitle}>Sign in to access the medical data integration dashboard</div>

          <div style={styles.demoCard}>
            <div style={styles.demoTitle}>Demo Credentials</div>
            <div style={styles.demoItem}>Doctor: dr.smith@hospital.com / password123</div>
            <div style={styles.demoItem}>Admin: admin@hospital.com / admin123</div>
          </div>

          {error && <div style={styles.errorBox}>Error: {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="doctor@hospital.com"
                value={form.email}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
            <div style={styles.row}>
              <label style={styles.rememberLabel}>
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                Remember me
              </label>
              <a href="#" style={styles.forgotLink}>Forgot password?</a>
            </div>
            <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.footer}>
            Don't have an account? <Link to="/signup" style={styles.footerLink}>Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
