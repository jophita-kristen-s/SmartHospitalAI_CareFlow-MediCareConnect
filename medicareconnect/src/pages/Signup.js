import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, DEPARTMENTS, APP_NAME } from '../utils/constants';
import { isValidEmail, isStrongPassword } from '../utils/helpers';

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  container: { width: '100%', maxWidth: '480px' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, justifyContent: 'center' },
  logoIcon: {
    width: 44, height: 44,
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, boxShadow: '0 4px 14px rgba(59,130,246,0.35)', color: '#fff', fontWeight: 800,
  },
  logoText: { fontSize: 22, fontWeight: 800, color: '#1e293b' },
  logoSpan: { color: '#3b82f6' },
  card: {
    background: '#fff', borderRadius: 20, padding: '36px 40px',
    boxShadow: '0 8px 40px rgba(59,130,246,0.12)',
  },
  title: { fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: {
    width: '100%', padding: '11px 13px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, color: '#1e293b', background: '#f8fafc',
    outline: 'none', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '11px 13px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, color: '#1e293b', background: '#f8fafc',
    outline: 'none', boxSizing: 'border-box',
  },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 10, padding: '11px 14px',
    color: '#dc2626', fontSize: 13, marginBottom: 16,
  },
  fieldError: { fontSize: 11, color: '#dc2626', marginTop: 3 },
  btn: {
    width: '100%', padding: 14,
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
    marginTop: 8, transition: 'opacity 0.2s',
  },
  footer: { textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 18 },
  footerLink: { color: '#3b82f6', fontWeight: 600, textDecoration: 'none' },
};

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'nurse', department: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!isStrongPassword(form.password)) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.department) e.department = 'Select a department';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      department: form.department,
    });

    if (result.success) navigate('/dashboard');
    else setApiError(result.error);
  };

  const Field = ({ name, label, type = 'text', placeholder }) => (
    <div style={s.formGroup}>
      <label style={s.label}>{label}</label>
      <input
        style={{ ...s.input, borderColor: errors[name] ? '#fca5a5' : '#e2e8f0' }}
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.target.style.borderColor = errors[name] ? '#fca5a5' : '#e2e8f0')}
      />
      {errors[name] && <div style={s.fieldError}>{errors[name]}</div>}
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.logo}>
          <div style={s.logoIcon}>+</div>
          <div style={s.logoText}><span style={s.logoSpan}>{APP_NAME}</span></div>
        </div>

        <div style={s.card}>
          <div style={s.title}>Create Account</div>
          <div style={s.subtitle}>Create your account for the medical data integration system</div>

          {apiError && <div style={s.error}>Error: {apiError}</div>}

          <form onSubmit={handleSubmit}>
            <div style={s.grid}>
              <Field name="name" label="Full Name" placeholder="Dr. Jane Smith" />
              <Field name="email" label="Email Address" type="email" placeholder="jane@hospital.com" />
            </div>
            <div style={s.grid}>
              <Field name="password" label="Password" type="password" placeholder="Min. 8 characters" />
              <Field name="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" />
            </div>
            <div style={s.grid}>
              <div style={s.formGroup}>
                <label style={s.label}>Role</label>
                <select style={s.select} name="role" value={form.role} onChange={handleChange}>
                  {Object.values(ROLES).map((role) => (
                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Department</label>
                <select
                  style={{ ...s.select, borderColor: errors.department ? '#fca5a5' : '#e2e8f0' }}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
                {errors.department && <div style={s.fieldError}>{errors.department}</div>}
              </div>
            </div>
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={s.footer}>
            Already have an account? <Link to="/login" style={s.footerLink}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
