import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pageVariants } from '../styles/theme';
import { Spinner } from '../components/Loader';

export default function Login() {
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async call
    await new Promise(r => setTimeout(r, 900));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
  };

  return (
    <motion.div
      key="login"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-4"
            style={{ background: 'linear-gradient(135deg,#00bcd4,#006064)', boxShadow: '0 0 32px rgba(0,188,212,0.4)' }}
          >
            🏥
          </div>
          <h1 className="gradient-text" style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.8rem' }}>
            CareFlow
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans', marginTop: 4 }}>
            MediCareConnect · India's Health Platform
          </p>
        </motion.div>

        {/* Card */}
        <div className="auth-card p-8 shadow-2xl">
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.35rem', color: '#f1f5f9', marginBottom: 6 }}>
            Welcome back 👋
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans', marginBottom: 28 }}>
            Sign in to your health dashboard
          </p>

          {/* Demo hint */}
          <div
            className="flex items-center gap-2 p-3 rounded-xl mb-5"
            style={{ background: 'rgba(0,188,212,0.07)', border: '1px solid rgba(0,188,212,0.2)' }}
          >
            <AlertCircle size={14} color="#00bcd4" />
            <span style={{ fontSize: 12, color: 'rgba(0,188,212,0.85)', fontFamily: 'DM Sans' }}>
              Demo: <strong>gopika@careflow.in</strong> / <strong>Care@123</strong>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>Email</label>
              <div className="relative">
                <Mail size={15} color="rgba(255,255,255,0.3)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  required
                  className="input-modern"
                  style={{ paddingLeft: 38 }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setAuthError(''); }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>Password</label>
              <div className="relative">
                <Lock size={15} color="rgba(255,255,255,0.3)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  className="input-modern"
                  style={{ paddingLeft: 38, paddingRight: 42 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPw
                    ? <EyeOff size={15} color="rgba(255,255,255,0.38)" />
                    : <Eye size={15} color="rgba(255,255,255,0.38)" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <AlertCircle size={14} color="#f87171" />
                <span style={{ fontSize: 12, color: '#f87171', fontFamily: 'DM Sans' }}>{authError}</span>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 mt-2"
              style={{ fontSize: 15, opacity: loading ? 0.8 : 1 }}
            >
              {loading ? <Spinner size={18} color="#fff" /> : 'Sign In →'}
            </motion.button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.35)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#00bcd4', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
