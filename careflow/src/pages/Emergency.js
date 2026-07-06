import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Clock, AlertTriangle, Wifi } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pageVariants } from '../styles/theme';

const CONTACTS = [
  { name: 'Ambulance',       number: '108',            icon: '🚑', color: '#ef4444' },
  { name: 'Police',          number: '100',            icon: '👮', color: '#3b82f6' },
  { name: 'Fire Brigade',    number: '101',            icon: '🔥', color: '#f97316' },
  { name: 'My Doctor',       number: '+91 98401 11111', icon: '👩‍⚕️', color: '#10b981' },
];

const TRACK_STEPS = [
  { label: 'SOS Sent',       detail: 'Your GPS location shared' },
  { label: 'Dispatching',    detail: 'Ambulance being assigned' },
  { label: 'En Route',       detail: 'ETA 8 minutes' },
  { label: 'Arrived',        detail: 'Help is at your location' },
];

export default function Emergency() {
  const { user } = useAuth();

  const [countdown, setCountdown] = useState(null);   // null | 3 | 2 | 1
  const [sosActive, setSosActive] = useState(false);
  const [step,      setStep]      = useState(0);
  const [progress,  setProgress]  = useState(0);

  /* ── countdown before activation ── */
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setSosActive(true);
      setStep(0);
      setProgress(12);
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* ── auto-advance tracking steps ── */
  useEffect(() => {
    if (!sosActive || step >= 3) return;
    const t = setTimeout(() => {
      setStep(s => s + 1);
      setProgress(p => Math.min(p + 30, 100));
    }, 3000);
    return () => clearTimeout(t);
  }, [sosActive, step]);

  const handleSOSPress = () => {
    if (!sosActive && countdown === null) setCountdown(3);
  };
  const handleCancel = () => {
    setSosActive(false); setStep(0); setProgress(0); setCountdown(null);
  };

  return (
    <motion.div
      key="emergency"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 md:p-8 max-w-2xl mx-auto min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <AlertTriangle size={18} color="#ef4444" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.4rem', color: '#f1f5f9' }}>Emergency</h1>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>
            Tap SOS · Alerts emergency services immediately
          </div>
        </div>
      </div>

      {/* ── SOS BUTTON ── */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>

          {/* Background ripple rings (always pulsing softly) */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                inset: `-${i * 18}px`,
                border: `1px solid rgba(239,68,68,${0.15 - i * 0.04})`,
                borderRadius: '50%',
              }}
              animate={{ scale: [1, 1.07, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity }}
            />
          ))}

          {/* Active ripples */}
          {sosActive && (
            <>
              <div className="sos-ripple" />
              <div className="sos-ripple-2" />
            </>
          )}

          {/* Countdown overlay */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20 rounded-full"
                style={{ background: 'rgba(239,68,68,0.92)' }}
              >
                <motion.span
                  key={countdown}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 80, color: 'white' }}
                >
                  {countdown}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.button
            onClick={handleSOSPress}
            whileTap={{ scale: 0.93 }}
            className={`btn-danger relative z-10 ${sosActive ? 'sos-pulse' : ''}`}
            style={{ width: 168, height: 168, fontSize: sosActive ? 20 : 30, letterSpacing: '0.06em' }}
          >
            {sosActive ? '🚨 ACTIVE' : 'SOS'}
          </motion.button>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', textAlign: 'center', fontFamily: 'DM Sans', marginTop: 8 }}>
          {sosActive
            ? 'Emergency services alerted · Hold to cancel'
            : countdown !== null
            ? 'Activating...'
            : 'Tap once to activate · Shares your GPS location'}
        </p>

        <AnimatePresence>
          {sosActive && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={handleCancel}
              className="btn-ghost mt-4"
            >
              ✕ Cancel SOS
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── AMBULANCE TRACKING ── */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 22 }}
            className="card-premium p-5 mb-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="section-title">🚑 Ambulance Tracking</div>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#10b981' }}
                />
                <span style={{ fontSize: 12, color: '#10b981', fontFamily: 'DM Sans' }}>Live</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full rounded-full mb-5" style={{ height: 6, background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg,#ef4444,#f97316)',
                  boxShadow: '0 0 10px rgba(239,68,68,0.55)',
                }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-4">
              {TRACK_STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: i <= step ? 1 : 0.28 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: i <= step ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${i <= step ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    {i < step ? (
                      <span style={{ fontSize: 12, color: '#10b981' }}>✓</span>
                    ) : i === step ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Wifi size={12} color="#10b981" />
                      </motion.div>
                    ) : (
                      <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: i <= step ? '#e2e8f0' : 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans' }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{s.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ETA */}
            <div className="p-3 rounded-xl flex items-center gap-3"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Clock size={16} color="#ef4444" />
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>Estimated arrival</div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit', color: '#ef4444' }}>8 min</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <MapPin size={13} color="rgba(255,255,255,0.38)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Puducherry</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EMERGENCY CONTACTS ── */}
      <div className="card-premium p-5 mb-5">
        <div className="section-title mb-4">Emergency Contacts</div>
        <div className="grid grid-cols-2 gap-3">
          {CONTACTS.map((c, i) => (
            <motion.a
              key={i}
              href={`tel:${c.number}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="glass-card p-3 flex items-center gap-3"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${c.color}18`, border: `1px solid ${c.color}28` }}
              >
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans' }}>{c.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: 'Outfit' }}>{c.number}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* ── CRITICAL MEDICAL INFO ── */}
      <div className="glass-card p-4"
        style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
        <div className="label-sm mb-3" style={{ color: 'rgba(239,68,68,0.8)' }}>Critical Medical Info</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Blood Group', value: user?.bloodGroup || 'B+' },
            { label: 'Allergy',     value: 'Penicillin' },
            { label: 'Condition',   value: 'Mild Asthma' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans' }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Outfit', color: '#f1f5f9', marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
