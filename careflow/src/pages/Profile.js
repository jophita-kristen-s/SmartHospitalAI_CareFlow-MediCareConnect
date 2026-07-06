import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Shield, CreditCard,
  Heart, Users, Camera, Check,
  ChevronDown, ChevronUp, LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pageVariants } from '../styles/theme';
import { BLOOD_GROUPS } from '../services/mockService';

/* ── Animated Toggle ── */
function Toggle({ value, onChange }) {
  return (
    <motion.div onClick={() => onChange(!value)} className="cursor-pointer relative flex-shrink-0"
      style={{ width: 46, height: 24, borderRadius: 12, background: value ? '#00bcd4' : 'rgba(255,255,255,0.12)', transition: 'background 0.22s' }}>
      <motion.div animate={{ x: value ? 24 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </motion.div>
  );
}

/* ── Collapsible section card ── */
function Section({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card-premium mb-4 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
            <Icon size={16} color={color} />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={15} color="rgba(255,255,255,0.35)" /> : <ChevronDown size={15} color="rgba(255,255,255,0.35)" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
            style={{ overflow: 'hidden' }}>
            <div className="px-5 pb-5">
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Text field ── */
function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="mb-4">
      <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>{label}</label>
      <input type={type} className="input-modern" value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
        style={{ colorScheme: type === 'date' ? 'dark' : undefined }} />
    </div>
  );
}

/* ── Textarea field ── */
function TextArea({ label, value, onChange, placeholder, rows = 2 }) {
  return (
    <div className="mb-4">
      <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>{label}</label>
      <textarea className="input-modern" rows={rows} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ resize: 'none' }} />
    </div>
  );
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  /* Local form state initialised from context */
  const [form, setForm] = useState({
    name:              user?.name              || '',
    age:               user?.age               || '',
    phone:             user?.phone             || '',
    bloodGroup:        user?.bloodGroup        || 'B+',
    hasInsurance:      user?.hasInsurance      ?? true,
    insuranceProvider: user?.insuranceProvider || '',
    policyNumber:      user?.policyNumber      || '',
    isESIC:            user?.isESIC            ?? true,
    esicNumber:        user?.esicNumber        || '',
    allergies:         user?.allergies         || '',
    chronicDiseases:   user?.chronicDiseases   || '',
    emergencyContact:  user?.emergencyContact  || '',
  });

  const set = field => val => setForm(f => ({ ...f, [field]: val }));

  const handleSave = () => {
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = form.name ? form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'CF';

  return (
    <motion.div
      key="profile"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 md:p-8 max-w-2xl mx-auto min-h-screen"
    >
      {/* ── AVATAR HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,#00bcd4,#006064)',
              fontSize: 36,
              boxShadow: '0 0 32px rgba(0,188,212,0.42)',
            }}>
            {initials}
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: '#00bcd4', border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,188,212,0.4)' }}>
            <Camera size={14} color="white" />
          </motion.button>
        </div>
        <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.3rem', color: '#f1f5f9' }}>{form.name || 'Your Name'}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans', marginTop: 3 }}>{user?.id || 'CF-2024'}</div>
        <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
          <span className="tag">{form.bloodGroup}</span>
          {form.hasInsurance && <span className="badge-valid">Insured</span>}
          {form.isESIC && <span className="tag" style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.25)', color: '#93c5fd' }}>ESIC</span>}
        </div>
      </motion.div>

      {/* ── BASIC INFO ── */}
      <Section title="Basic Information" icon={User} color="#00bcd4">
        <Field label="Full Name" value={form.name}  onChange={set('name')}  placeholder="Your full name" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Age"   value={form.age}   onChange={set('age')}   type="number" placeholder="Age" />
          <Field label="Phone" value={form.phone} onChange={set('phone')} type="tel"    placeholder="+91 xxxxx xxxxx" />
        </div>
        <div className="mb-2">
          <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Blood Group</label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map(bg => (
              <motion.button key={bg} whileTap={{ scale: 0.94 }} onClick={() => set('bloodGroup')(bg)}
                className="py-2 rounded-xl text-xs font-bold"
                style={{
                  fontFamily: 'Outfit',
                  background: form.bloodGroup === bg ? 'rgba(239,68,68,0.14)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.bloodGroup === bg ? 'rgba(239,68,68,0.48)' : 'rgba(255,255,255,0.08)'}`,
                  color: form.bloodGroup === bg ? '#f87171' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                }}>
                {bg}
              </motion.button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── INSURANCE ── */}
      <Section title="Insurance Details" icon={Shield} color="#10b981">
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans' }}>Health Insurance</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Do you have insurance?</div>
          </div>
          <Toggle value={form.hasInsurance} onChange={set('hasInsurance')} />
        </div>
        <AnimatePresence>
          {form.hasInsurance && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <Field label="Insurance Provider" value={form.insuranceProvider} onChange={set('insuranceProvider')} placeholder="e.g. Star Health, HDFC ERGO" />
              <Field label="Policy Number"      value={form.policyNumber}      onChange={set('policyNumber')}      placeholder="e.g. SH-XXXXXXX" />
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* ── ESIC ── */}
      <Section title="ESIC Details" icon={CreditCard} color="#3b82f6">
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans' }}>ESIC Member</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Employees' State Insurance</div>
          </div>
          <Toggle value={form.isESIC} onChange={set('isESIC')} />
        </div>
        <AnimatePresence>
          {form.isESIC && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <Field label="ESIC Number" value={form.esicNumber} onChange={set('esicNumber')} placeholder="ES-XX-XX-XXXXXX-XXX" />
              <div className="p-3 rounded-xl flex items-start gap-3 mb-2"
                style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <span style={{ fontSize: 16, marginTop: 1 }}>ℹ️</span>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                  ESIC provides medical, cash, maternity &amp; dependent benefits to employees earning up to ₹21,000/month.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* ── MEDICAL INFO ── */}
      <Section title="Medical Information" icon={Heart} color="#ef4444">
        <TextArea label="Allergies" value={form.allergies} onChange={set('allergies')}
          placeholder="e.g. Penicillin, Aspirin, Latex…" />
        {form.allergies && (
          <div className="flex flex-wrap gap-2 mb-3">
            {form.allergies.split(',').map((a, i) => a.trim() && (
              <span key={i} className="badge-expired" style={{ fontSize: 11 }}>⚠ {a.trim()}</span>
            ))}
          </div>
        )}
        <TextArea label="Chronic Diseases / Conditions" value={form.chronicDiseases} onChange={set('chronicDiseases')}
          placeholder="e.g. Type 2 Diabetes, Hypertension…" />
      </Section>

      {/* ── EMERGENCY CONTACT ── */}
      <Section title="Emergency Contact" icon={Users} color="#f59e0b">
        <TextArea label="Contact Details" value={form.emergencyContact} onChange={set('emergencyContact')}
          placeholder="Name (Relation) · +91 xxxxx xxxxx" rows={2} />
      </Section>

      {/* ── SAVE ── */}
      <motion.button
        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="btn-primary w-full py-4 flex items-center justify-center gap-2 mb-4"
        style={{ fontSize: 15 }}>
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2">
              <Check size={18} /> Profile Saved!
            </motion.span>
          ) : (
            <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Save Profile
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── LOGOUT ── */}
      <motion.button
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl mb-6"
        style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.22)',
          color: '#f87171',
          fontFamily: 'Outfit', fontWeight: 700, fontSize: 14,
          cursor: 'pointer',
        }}>
        <LogOut size={16} /> Log Out
      </motion.button>
    </motion.div>
  );
}
