import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Shield, Pill, AlertTriangle,
  CalendarDays, FolderOpen, Activity,
  Droplets, Wind, Thermometer, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { pageVariants, cardVariants } from '../styles/theme';
import { StatCard } from '../components/Card';
import { DashboardSkeleton } from '../components/Loader';

const VITALS = [
  { label: 'Heart Rate',      value: '74',      unit: 'bpm',   icon: Heart,       color: '#ef4444' },
  { label: 'Blood Pressure',  value: '116/76',  unit: 'mmHg',  icon: Activity,    color: '#00bcd4' },
  { label: 'Temperature',     value: '98.4',    unit: '°F',    icon: Thermometer, color: '#f59e0b' },
  { label: 'SpO₂',            value: '99',      unit: '%',     icon: Wind,        color: '#10b981' },
];

const QUICK = [
  { label: 'Emergency',       path: '/emergency',    icon: AlertTriangle, color: '#ef4444' },
  { label: 'Book Appt.',      path: '/appointments', icon: CalendarDays,  color: '#00bcd4' },
  { label: 'Records',         path: '/records',      icon: FolderOpen,    color: '#10b981' },
];

export default function Dashboard() {
  const { user }       = useAuth();
  const { medications } = useHealth();
  const navigate        = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div
      key="dashboard"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 md:p-8 max-w-3xl mx-auto"
    >
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 2 }}>
            {greeting} 👋
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.65rem', color: '#f1f5f9' }}>
            Hi, {firstName}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="tag">ID: {user?.id || 'CF-2024'}</span>
            <span className="badge-valid">Active</span>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#00bcd4,#006064)', boxShadow: '0 0 22px rgba(0,188,212,0.38)' }}
          onClick={() => navigate('/profile')}
        >
          👩‍⚕️
        </motion.div>
      </motion.div>

      {/* ── HEALTH SUMMARY ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard icon={Droplets} label="Blood Group"  value={user?.bloodGroup || 'B+'} color="#ef4444" delay={0} />
        <StatCard icon={Shield}   label="Insurance"    value={user?.hasInsurance ? 'Active' : 'None'} color="#10b981" delay={1} />
        <StatCard icon={Pill}     label="Medications"  value={`${medications.length} Active`} color="#00bcd4" delay={2} />
      </div>

      {/* ── VITALS ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.25 } }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="section-title">Today's Vitals</span>
          <span style={{ fontSize: 12, color: '#00bcd4', fontFamily: 'DM Sans', cursor: 'pointer' }}>Sync ↻</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {VITALS.map((v, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              className="glass-card p-3 flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${v.color}18` }}
              >
                <v.icon size={15} color={v.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans' }}>{v.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Outfit', color: '#f1f5f9' }}>
                  {v.value} <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.38)' }}>{v.unit}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.33 } }}
        className="mb-6"
      >
        <div className="section-title mb-3">Quick Actions</div>
        <div className="grid grid-cols-3 gap-3">
          {QUICK.map(({ label, path, icon: Icon, color }, i) => (
            <motion.button
              key={i}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(path)}
              className="glass-card p-4 flex flex-col items-center gap-2 cursor-pointer"
              style={{ border: 'none' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}28` }}
              >
                <Icon size={19} color={color} />
              </div>
              <span style={{ fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, color: 'rgba(255,255,255,0.68)', textAlign: 'center' }}>
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── TODAY INSIGHTS: MEDICATIONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.42 } }}
        className="card-premium p-5 mb-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="section-title flex items-center gap-2">
            <Pill size={16} color="#00bcd4" /> Today's Medications
          </div>
          <button
            onClick={() => navigate('/records')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00bcd4', fontSize: 12, fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', gap: 2 }}
          >
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {medications.map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.46 + i * 0.08 } }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: med.color, boxShadow: `0 0 6px ${med.color}` }} />
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans' }}>
                  {med.name} · {med.dosage}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{med.frequency}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── UPCOMING APPOINTMENT ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.52 } }}
        className="glass-card p-5 mb-4"
        style={{
          background: 'linear-gradient(135deg,rgba(0,188,212,0.07) 0%,rgba(0,96,100,0.04) 100%)',
          borderColor: 'rgba(0,188,212,0.2)',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="label-sm mb-1" style={{ color: 'rgba(0,188,212,0.7)' }}>Next Appointment</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>
              Dr. Priya Nair
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              General Medicine · JIPMER, Puducherry
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="tag">Mar 28, 2024</span>
              <span className="tag">10:30 AM</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/appointments')}
            className="btn-primary"
            style={{ fontSize: 12, padding: '8px 16px', borderRadius: 10 }}
          >
            Reschedule
          </motion.button>
        </div>
      </motion.div>

      {/* ── INSURANCE BANNER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.6 } }}
        className="glass-card p-4 flex items-center justify-between"
        style={{ borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.04)' }}
      >
        <div className="flex items-center gap-3">
          <Shield size={20} color="#10b981" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans' }}>
              {user?.insuranceProvider || 'Star Health Insurance'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Policy: {user?.policyNumber || 'SH-XXXXXXX'} · ESIC {user?.isESIC ? 'Active' : 'N/A'}
            </div>
          </div>
        </div>
        <span className="badge-valid">Active</span>
      </motion.div>
    </motion.div>
  );
}
