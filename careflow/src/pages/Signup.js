import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pageVariants } from '../styles/theme';
import { Spinner } from '../components/Loader';

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name     = 'Name is required';
    if (!form.email.includes('@')) errs.email = 'Valid email required';
    if (form.password.length < 6)  errs.password = 'Min 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    signup(form.name, form.email, form.password);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2200);
  };

  return (
    <motion.div
      key="signup"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-3xl flex items-center justify-center text-2xl mb-3"
            style={{ background: 'linear-gradient(135deg,#00bcd4,#006064)', boxShadow: '0 0 28px rgba(0,188,212,0.38)' }}
          >🏥</div>
          <h1 className="gradient-text" style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.7rem' }}>CareFlow</h1>
        </motion.div>

        <div className="auth-card p-8">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981', boxShadow: '0 0 32px rgba(16,185,129,0.3)' }}
                >
                  <CheckCircle2 size={40} color="#10b981" />
                </motion.div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', color: '#f1f5f9' }}>
                  Account Created! 🎉
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', textAlign: 'center' }}>
                  Redirecting you to login…
                </p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: '#f1f5f9', marginBottom: 6 }}>
                  Create account
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans', marginBottom: 24 }}>
                  Join India's smartest health platform
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { field: 'name',     label: 'Full Name',       type: 'text',     icon: User,  placeholder: 'Gopika Sharma' },
                    { field: 'email',    label: 'Email',           type: 'email',    icon: Mail,  placeholder: 'you@example.com' },
                    { field: 'password', label: 'Password',        type: showPw ? 'text' : 'password', icon: Lock, placeholder: 'Min 6 chars' },
                    { field: 'confirm',  label: 'Confirm Password',type: 'password', icon: Lock,  placeholder: 'Repeat password' },
                  ].map(({ field, label, type, icon: Icon, placeholder }) => (
                    <div key={field}>
                      <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>{label}</label>
                      <div className="relative">
                        <Icon size={15} color="rgba(255,255,255,0.3)"
                          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                          type={type}
                          className="input-modern"
                          style={{
                            paddingLeft: 38,
                            paddingRight: field === 'password' ? 42 : 16,
                            borderColor: errors[field] ? 'rgba(239,68,68,0.5)' : undefined,
                          }}
                          placeholder={placeholder}
                          value={form[field]}
                          onChange={set(field)}
                        />
                        {field === 'password' && (
                          <button type="button" onClick={() => setShowPw(v => !v)}
                            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            {showPw ? <EyeOff size={15} color="rgba(255,255,255,0.35)" /> : <Eye size={15} color="rgba(255,255,255,0.35)" />}
                          </button>
                        )}
                      </div>
                      {errors[field] && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <AlertCircle size={12} color="#f87171" />
                          <span style={{ fontSize: 11, color: '#f87171', fontFamily: 'DM Sans' }}>{errors[field]}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 mt-1"
                    style={{ fontSize: 15 }}
                  >
                    {loading ? <Spinner size={18} color="#fff" /> : 'Create Account →'}
                  </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.35)' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#00bcd4', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
