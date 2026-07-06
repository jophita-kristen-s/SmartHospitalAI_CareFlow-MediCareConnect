import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, CheckCircle2, Building2,
  Stethoscope, Activity, Pill, Scissors,
  RefreshCw, Heart, Brain, Bone, Wind,
  Clock, ChevronRight, MapPin,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { pageVariants } from '../styles/theme';
import {
  HOSPITALS_PUDUCHERRY, TREATMENT_TYPES,
  DEPARTMENTS, TIME_SLOTS,
} from '../services/mockService';

/* Map icon string → lucide component */
const ICON_MAP = {
  Stethoscope, Activity, Pill, Scissors, RefreshCw,
  Heart, Brain, Bone, Wind, Building2,
};

const STEPS = ['Hospital', 'Treatment', 'Department', 'Date & Time'];

/* ── Selectable card ── */
function SelectCard({ selected, onClick, children, borderColor }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer p-3 rounded-2xl transition-all"
      style={{
        background: selected ? `rgba(0,188,212,0.1)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? (borderColor || 'rgba(0,188,212,0.45)') : 'rgba(255,255,255,0.07)'}`,
        boxShadow: selected ? `0 0 16px ${borderColor || 'rgba(0,188,212,0.2)'}` : 'none',
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Appointments() {
  const { addAppointment, appointments } = useHealth();

  const [step,       setStep]       = useState(0);
  const [hospital,   setHospital]   = useState(null);
  const [treatment,  setTreatment]  = useState(null);
  const [department, setDepartment] = useState(null);
  const [date,       setDate]       = useState('');
  const [time,       setTime]       = useState(null);
  const [booked,     setBooked]     = useState(false);
  const [view,       setView]       = useState('book'); // 'book' | 'list'

  const canNext = [!!hospital, !!treatment, !!department, !!(date && time)];

  const handleBook = () => {
    const hosp = HOSPITALS_PUDUCHERRY.find(h => h.id === hospital);
    const trt  = TREATMENT_TYPES.find(t => t.id === treatment);
    const dept = DEPARTMENTS.find(d => d.id === department);
    addAppointment({
      hospital:   hosp?.name,
      treatment:  trt?.label,
      department: dept?.label,
      date, time,
      doctor: 'Dr. Assigned',
      status: 'upcoming',
    });
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setStep(0); setHospital(null); setTreatment(null);
      setDepartment(null); setDate(''); setTime(null);
      setView('list');
    }, 3200);
  };

  /* ── Success screen ── */
  if (booked) return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(16,185,129,0.14)', border: '2px solid #10b981', boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
      >
        <CheckCircle2 size={48} color="#10b981" />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', color: '#f1f5f9', textAlign: 'center' }}>
        Appointment Booked!
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.35 } }}
        style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginTop: 8, fontFamily: 'DM Sans' }}>
        {HOSPITALS_PUDUCHERRY.find(h => h.id === hospital)?.name} ·{' '}
        {TREATMENT_TYPES.find(t => t.id === treatment)?.label}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}
        className="glass-card mt-6 px-6 py-3 flex items-center gap-3"
        style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
        <CalendarDays size={16} color="#10b981" />
        <span style={{ fontFamily: 'Outfit', fontWeight: 600, color: '#e2e8f0' }}>{date} · {time}</span>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      key="appointments"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 md:p-8 max-w-2xl mx-auto min-h-screen"
    >
      {/* Header + toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,188,212,0.14)', border: '1px solid rgba(0,188,212,0.3)' }}>
            <CalendarDays size={18} color="#00bcd4" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.4rem', color: '#f1f5f9' }}>Appointments</h1>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans' }}>Puducherry · Book or view</div>
          </div>
        </div>
        <div className="flex gap-2">
          {['book', 'list'].map(v => (
            <motion.button key={v} whileTap={{ scale: 0.95 }} onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize"
              style={{
                fontFamily: 'DM Sans',
                background: view === v ? 'rgba(0,188,212,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${view === v ? 'rgba(0,188,212,0.4)' : 'rgba(255,255,255,0.09)'}`,
                color: view === v ? '#67e8f9' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
              }}>
              {v === 'book' ? '+ Book' : 'My Appts'}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════ LIST VIEW ══════════ */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {appointments.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans', fontSize: 14 }}>
                  No appointments yet. Tap + Book to add one.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((a, i) => (
                  <motion.div key={a.id || i}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
                    className="card-premium p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>
                          {a.hospital}
                        </div>
                        <div style={{ fontSize: 13, color: '#00bcd4', fontFamily: 'DM Sans', fontWeight: 600, marginTop: 2 }}>
                          {a.department} · {a.treatment}
                        </div>
                      </div>
                      <span className={a.status === 'upcoming' ? 'badge-upcoming' : 'badge-completed'}>
                        {a.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={12} color="rgba(255,255,255,0.35)" />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{a.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} color="rgba(255,255,255,0.35)" />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{a.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════ BOOKING WIZARD ══════════ */}
        {view === 'book' && (
          <motion.div key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((s, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    animate={{ scale: i === step ? 1 : 0.95 }}
                    className="flex items-center gap-1.5 cursor-pointer"
                    onClick={() => i < step && setStep(i)}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: i < step ? '#10b981' : i === step ? '#00bcd4' : 'rgba(255,255,255,0.08)',
                        color: i <= step ? 'white' : 'rgba(255,255,255,0.28)',
                        fontFamily: 'Outfit',
                      }}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    {i === step && (
                      <span style={{ fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, color: '#67e8f9' }}>{s}</span>
                    )}
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px" style={{ background: i < step ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* STEP 0 — Hospital */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="section-title flex items-center gap-2 mb-4">
                    <Building2 size={16} color="#00bcd4" /> Select Hospital
                  </div>
                  <div className="space-y-3">
                    {HOSPITALS_PUDUCHERRY.map(h => (
                      <SelectCard key={h.id} selected={hospital === h.id} onClick={() => setHospital(h.id)} borderColor={`${h.color}55`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ background: `${h.color}18` }}>{h.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{h.name}</span>
                              {hospital === h.id && <CheckCircle2 size={14} color="#10b981" />}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans' }}>{h.full}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin size={10} color="rgba(255,255,255,0.28)" />
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{h.location}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Outfit', color: '#fbbf24' }}>⭐ {h.rating}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>{h.type.split('·')[0].trim()}</div>
                          </div>
                        </div>
                      </SelectCard>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — Treatment */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="section-title mb-4">Select Treatment Type</div>
                  <div className="grid grid-cols-1 gap-3">
                    {TREATMENT_TYPES.map(t => {
                      const Icon = ICON_MAP[t.icon] || Stethoscope;
                      return (
                        <SelectCard key={t.id} selected={treatment === t.id} onClick={() => setTreatment(t.id)} borderColor={`${t.color}55`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: `${t.color}18`, border: `1px solid ${t.color}25` }}>
                              <Icon size={18} color={t.color} />
                            </div>
                            <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{t.label}</span>
                            {treatment === t.id && <CheckCircle2 size={15} color="#10b981" style={{ marginLeft: 'auto' }} />}
                          </div>
                        </SelectCard>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Department */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="section-title mb-4">Select Department</div>
                  <div className="grid grid-cols-2 gap-3">
                    {DEPARTMENTS.map(d => {
                      const Icon = ICON_MAP[d.icon] || Stethoscope;
                      return (
                        <SelectCard key={d.id} selected={department === d.id} onClick={() => setDepartment(d.id)} borderColor={`${d.color}55`}>
                          <div className="flex flex-col items-center gap-2 py-2">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                              style={{ background: `${d.color}18`, border: `1px solid ${d.color}25` }}>
                              <Icon size={20} color={d.color} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', color: '#e2e8f0', textAlign: 'center' }}>
                              {d.label}
                            </span>
                            {department === d.id && <CheckCircle2 size={13} color="#10b981" />}
                          </div>
                        </SelectCard>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Date & Time */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="section-title flex items-center gap-2 mb-4">
                    <CalendarDays size={16} color="#00bcd4" /> Date &amp; Time
                  </div>
                  <div className="card-premium p-4 mb-4">
                    <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Select Date</label>
                    <input
                      type="date"
                      className="input-modern"
                      style={{ colorScheme: 'dark' }}
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  <div className="card-premium p-4">
                    <label className="label-sm" style={{ display: 'block', marginBottom: 10 }}>Select Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <motion.button key={slot}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                          onClick={() => setTime(slot)}
                          style={{
                            padding: '10px 6px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontFamily: 'DM Sans',
                            fontWeight: 600,
                            background: time === slot ? 'rgba(0,188,212,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${time === slot ? 'rgba(0,188,212,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            color: time === slot ? '#67e8f9' : 'rgba(255,255,255,0.55)',
                            cursor: 'pointer',
                          }}>
                          {slot}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep(s => s - 1)} className="btn-outline flex-1 py-3">
                  ← Back
                </motion.button>
              )}
              {step < 3 ? (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => canNext[step] && setStep(s => s + 1)}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                  style={{ opacity: canNext[step] ? 1 : 0.38, cursor: canNext[step] ? 'pointer' : 'not-allowed' }}>
                  Continue <ChevronRight size={16} />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => canNext[3] && handleBook()}
                  className="btn-primary flex-1 py-3"
                  style={{ opacity: canNext[3] ? 1 : 0.38, cursor: canNext[3] ? 'pointer' : 'not-allowed' }}>
                  Confirm Booking ✓
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
