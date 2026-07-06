import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, History, Pill, Scissors, Plus,
  Trash2, Edit2, X, Calendar, Building2, User,
  FileText, Syringe, Stethoscope,
} from 'lucide-react';
import { useAuth }   from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { pageVariants } from '../styles/theme';
import Modal from '../components/Modal';

const COLORS = ['#00bcd4','#10b981','#f59e0b','#a855f7','#ef4444','#3b82f6','#ec4899'];

/* ── Inline field ── */
function Field({ label, value, onChange, type = 'text', placeholder, rows }) {
  return (
    <div className="mb-3">
      <label className="label-sm" style={{ display: 'block', marginBottom: 6 }}>{label}</label>
      {rows ? (
        <textarea className="input-modern" rows={rows} value={value}
          onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
          style={{ resize: 'none' }} />
      ) : (
        <input type={type} className="input-modern" value={value}
          onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
          style={{ colorScheme: type === 'date' ? 'dark' : undefined }} />
      )}
    </div>
  );
}

export default function MedicalRecords() {
  const { user }    = useAuth();
  const {
    medications, addMedication, updateMedication, deleteMedication,
    surgeries,   addSurgery,    updateSurgery,    deleteSurgery,
    history,
  } = useHealth();

  const [tab,      setTab]      = useState('qr');
  const [medModal, setMedModal] = useState(false);
  const [srgModal, setSrgModal] = useState(false);
  const [editMedId, setEditMedId] = useState(null);
  const [editSrgId, setEditSrgId] = useState(null);

  const blankMed = { name: '', dosage: '', frequency: '', color: '#00bcd4' };
  const blankSrg = { name: '', date: '', hospital: '', doctor: '', notes: '' };
  const [newMed, setNewMed] = useState(blankMed);
  const [newSrg, setNewSrg] = useState(blankSrg);

  const setM = f => v => setNewMed(m => ({ ...m, [f]: v }));
  const setS = f => v => setNewSrg(s => ({ ...s, [f]: v }));

  const openAddMed  = () => { setEditMedId(null); setNewMed(blankMed); setMedModal(true); };
  const openEditMed = (m) => { setEditMedId(m.id); setNewMed({ name: m.name, dosage: m.dosage, frequency: m.frequency, color: m.color }); setMedModal(true); };
  const saveMed = () => {
    if (!newMed.name) return;
    editMedId ? updateMedication(editMedId, newMed) : addMedication(newMed);
    setMedModal(false);
  };

  const openAddSrg  = () => { setEditSrgId(null); setNewSrg(blankSrg); setSrgModal(true); };
  const openEditSrg = (s) => { setEditSrgId(s.id); setNewSrg({ name: s.name, date: s.date, hospital: s.hospital, doctor: s.doctor, notes: s.notes }); setSrgModal(true); };
  const saveSrg = () => {
    if (!newSrg.name) return;
    editSrgId ? updateSurgery(editSrgId, newSrg) : addSurgery(newSrg);
    setSrgModal(false);
  };

  return (
    <motion.div
      key="records"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 md:p-8 max-w-2xl mx-auto min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(0,188,212,0.14)', border: '1px solid rgba(0,188,212,0.3)' }}>
          <FileText size={18} color="#00bcd4" />
        </div>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.4rem', color: '#f1f5f9' }}>Medical Records</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 mb-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {[
          { id: 'qr',      label: 'QR Code', icon: QrCode  },
          { id: 'history', label: 'History',  icon: History },
        ].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.97 }} onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg"
            style={{
              background: tab === t.id ? 'rgba(0,188,212,0.14)' : 'transparent',
              border: tab === t.id ? '1px solid rgba(0,188,212,0.3)' : '1px solid transparent',
              color: tab === t.id ? '#67e8f9' : 'rgba(255,255,255,0.4)',
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
            <t.icon size={14} /> {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════ QR TAB ══════════ */}
        {tab === 'qr' && (
          <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* QR Card */}
            <motion.div className="card-premium p-6 mb-5 flex flex-col items-center"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <div className="label-sm mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Emergency Medical QR</div>
              <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', boxShadow: '0 0 32px rgba(0,188,212,0.3)' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Top-left finder */}
                  <rect x="10" y="10" width="52" height="52" rx="6" fill="#111827"/>
                  <rect x="18" y="18" width="36" height="36" rx="4" fill="white"/>
                  <rect x="26" y="26" width="20" height="20" rx="3" fill="#111827"/>
                  {/* Top-right finder */}
                  <rect x="98" y="10" width="52" height="52" rx="6" fill="#111827"/>
                  <rect x="106" y="18" width="36" height="36" rx="4" fill="white"/>
                  <rect x="114" y="26" width="20" height="20" rx="3" fill="#111827"/>
                  {/* Bottom-left finder */}
                  <rect x="10" y="98" width="52" height="52" rx="6" fill="#111827"/>
                  <rect x="18" y="106" width="36" height="36" rx="4" fill="white"/>
                  <rect x="26" y="114" width="20" height="20" rx="3" fill="#111827"/>
                  {/* Data dots */}
                  {[
                    [72,10],[80,10],[88,10],[72,18],[88,18],[76,26],[80,26],[88,26],
                    [72,34],[80,34],[72,42],[76,42],[88,42],[72,50],[80,50],[88,50],
                    [10,72],[18,72],[26,72],[34,72],[10,80],[26,80],[34,80],[18,88],
                    [10,96],[26,96],[72,72],[80,72],[88,72],[96,72],[104,72],[80,80],
                    [96,80],[104,80],[72,88],[88,88],[96,88],[80,96],[88,96],[104,96],
                    [72,104],[80,104],[96,104],[72,112],[88,112],[104,112],
                    [80,120],[88,120],[96,120],[104,120],
                    [72,128],[80,128],[96,128],[104,128],
                    [72,136],[88,136],[96,136],
                  ].map(([x,y],i) => (
                    <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="#111827"/>
                  ))}
                </svg>
              </div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>
                {user?.name} · {user?.bloodGroup || 'B+'} · {user?.id || 'CF-2024'}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 4 }}>
                Scan for emergency medical data
              </div>
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                <span className="tag">Blood: {user?.bloodGroup || 'B+'}</span>
                <span className="tag">Allergy: Penicillin</span>
                <span className="tag">Asthma</span>
              </div>
            </motion.div>

            {/* Medications */}
            <div className="card-premium p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="section-title flex items-center gap-2">
                  <Pill size={16} color="#00bcd4" /> Medications
                </div>
                <motion.button whileTap={{ scale: 0.92 }} onClick={openAddMed}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0,188,212,0.14)', border: '1px solid rgba(0,188,212,0.28)', cursor: 'pointer' }}>
                  <Plus size={15} color="#00bcd4" />
                </motion.button>
              </div>
              <div className="space-y-3">
                {medications.map((m, i) => (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.07 } }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                    <div className="flex-1">
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans' }}>
                        {m.name} · {m.dosage}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{m.frequency}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditMed(m)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => deleteMedication(m.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {medications.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.28)', fontFamily: 'DM Sans', fontSize: 13, padding: '12px 0' }}>
                    No medications. Tap + to add.
                  </div>
                )}
              </div>
            </div>

            {/* Surgeries */}
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="section-title flex items-center gap-2">
                  <Scissors size={16} color="#ef4444" /> Surgery Records
                </div>
                <motion.button whileTap={{ scale: 0.92 }} onClick={openAddSrg}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer' }}>
                  <Plus size={15} color="#ef4444" />
                </motion.button>
              </div>
              <div className="space-y-3">
                {surgeries.map((s, i) => (
                  <motion.div key={s.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: i * 0.07 } }}
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.14)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{s.name}</div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditSrg(s)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)' }}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteSurgery(s.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} color="rgba(255,255,255,0.28)" />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 size={11} color="rgba(255,255,255,0.28)" />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.hospital}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={11} color="rgba(255,255,255,0.28)" />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.doctor}</span>
                      </div>
                    </div>
                    {s.notes && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.55 }}>{s.notes}</div>}
                  </motion.div>
                ))}
                {surgeries.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.28)', fontFamily: 'DM Sans', fontSize: 13, padding: '12px 0' }}>
                    No surgery records. Tap + to add.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════ HISTORY TAB ══════════ */}
        {tab === 'history' && (
          <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              {history.map((h, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.09 } }}
                  className="card-premium p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                      {h.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{h.type}</div>
                        <span className="tag">{h.date}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#00bcd4', marginBottom: 6, fontFamily: 'DM Sans', fontWeight: 600 }}>{h.doctor}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.6, fontFamily: 'DM Sans' }}>{h.notes}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ MEDICATION MODAL ══════════ */}
      <Modal open={medModal} onClose={() => setMedModal(false)} title={editMedId ? 'Edit Medication' : 'Add Medication'}>
        <Field label="Medicine Name"   value={newMed.name}      onChange={setM('name')}      placeholder="e.g. Metformin" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dosage"    value={newMed.dosage}    onChange={setM('dosage')}    placeholder="e.g. 500mg" />
          <Field label="Frequency" value={newMed.frequency} onChange={setM('frequency')} placeholder="e.g. Twice daily" />
        </div>
        <div className="mb-4">
          <label className="label-sm" style={{ display: 'block', marginBottom: 8 }}>Color Tag</label>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => setM('color')(c)}
                style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: newMed.color === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }} onClick={saveMed} className="btn-primary w-full py-3">
          {editMedId ? 'Save Changes' : 'Add Medication'} ✓
        </motion.button>
      </Modal>

      {/* ══════════ SURGERY MODAL ══════════ */}
      <Modal open={srgModal} onClose={() => setSrgModal(false)} title={editSrgId ? 'Edit Surgery' : 'Add Surgery Record'}>
        <Field label="Surgery Name" value={newSrg.name}     onChange={setS('name')}     placeholder="e.g. Appendectomy" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"     value={newSrg.date}     onChange={setS('date')}     type="date" />
          <Field label="Hospital" value={newSrg.hospital} onChange={setS('hospital')} placeholder="Hospital name" />
        </div>
        <Field label="Doctor" value={newSrg.doctor} onChange={setS('doctor')} placeholder="Dr. Name" />
        <Field label="Notes"  value={newSrg.notes}  onChange={setS('notes')}  placeholder="Procedure details, recovery…" rows={3} />
        <motion.button whileTap={{ scale: 0.96 }} onClick={saveSrg} className="btn-primary w-full py-3"
          style={{ background: 'linear-gradient(135deg,#ef4444,#991b1b)', boxShadow: '0 4px 18px rgba(239,68,68,0.32)' }}>
          {editSrgId ? 'Save Changes' : 'Add Surgery Record'} ✓
        </motion.button>
      </Modal>
    </motion.div>
  );
}
