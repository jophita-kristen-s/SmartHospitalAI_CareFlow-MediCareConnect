import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Upload, Trash2,
  CheckCircle, AlertTriangle, X, Clock,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { pageVariants } from '../styles/theme';
import Modal from '../components/Modal';

/* ── Helpers ── */
function getDaysLeft(date, validityDays) {
  const expiry = new Date(date);
  expiry.setDate(expiry.getDate() + Number(validityDays));
  return Math.ceil((expiry - new Date()) / 86400000);
}

function getStatus(daysLeft) {
  if (daysLeft < 0)   return 'expired';
  if (daysLeft <= 14) return 'expiring';
  return 'valid';
}

const STATUS_CFG = {
  valid:    { badge: 'badge-valid',    icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.2)'  },
  expiring: { badge: 'badge-expiring', icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)'  },
  expired:  { badge: 'badge-expired',  icon: X,             color: '#ef4444', bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.2)'   },
};

/* ── Single report card ── */
function ReportCard({ report, onDelete, index }) {
  const daysLeft = getDaysLeft(report.date, report.validityDays);
  const status   = getStatus(daysLeft);
  const cfg      = STATUS_CFG[status];
  const progress = Math.max(0, Math.min(100, (daysLeft / report.validityDays) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.08 } }}
      whileHover={{ scale: 1.01 }}
      className="card-premium p-5"
      style={{ borderColor: cfg.border, background: cfg.bg }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}25` }}>
            <FileText size={18} color={cfg.color} />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{report.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans' }}>
              Issued: {new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cfg.badge}>{STATUS_CFG[status].badge.replace('badge-', '')}</span>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => onDelete(report.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.22)' }}>
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full rounded-full mb-3" style={{ height: 5, background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.1, delay: index * 0.09, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg,${cfg.color}99,${cfg.color})` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock size={12} color={cfg.color} />
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Outfit', color: cfg.color }}>
            {daysLeft < 0
              ? `Expired ${Math.abs(daysLeft)}d ago`
              : daysLeft === 0
              ? 'Expires today!'
              : `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontFamily: 'DM Sans' }}>
          Validity: {report.validityDays}d
        </span>
      </div>
    </motion.div>
  );
}

export default function ReportTracking() {
  const { reports, addReport, deleteReport } = useHealth();
  const [modal,    setModal]    = useState(false);
  const [filter,   setFilter]   = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', validityDays: '90' });

  const setF = f => v => setForm(x => ({ ...x, [f]: v }));

  const counts = {
    all:      reports.length,
    valid:    reports.filter(r => getStatus(getDaysLeft(r.date, r.validityDays)) === 'valid').length,
    expiring: reports.filter(r => getStatus(getDaysLeft(r.date, r.validityDays)) === 'expiring').length,
    expired:  reports.filter(r => getStatus(getDaysLeft(r.date, r.validityDays)) === 'expired').length,
  };

  const filtered = filter === 'all'
    ? reports
    : reports.filter(r => getStatus(getDaysLeft(r.date, r.validityDays)) === filter);

  const handleAdd = () => {
    if (!form.name || !form.date) return;
    addReport({ ...form, validityDays: Number(form.validityDays) });
    setModal(false);
    setForm({ name: '', date: '', validityDays: '90' });
  };

  return (
    <motion.div
      key="reports"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 md:p-8 max-w-2xl mx-auto min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.14)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <FileText size={18} color="#f59e0b" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.4rem', color: '#f1f5f9' }}>Report Validity</h1>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans' }}>Track medical report expiry dates</div>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          onClick={() => setModal(true)} className="btn-primary px-4 py-2 flex items-center gap-2" style={{ fontSize: 13 }}>
          <Plus size={15} /> Add
        </motion.button>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { key: 'valid',    icon: '✅', color: '#10b981' },
          { key: 'expiring', icon: '⚠️', color: '#f59e0b' },
          { key: 'expired',  icon: '❌', color: '#ef4444' },
        ].map(s => (
          <motion.div key={s.key}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
            className="glass-card p-3 text-center cursor-pointer"
            style={{
              borderColor: filter === s.key ? `${s.color}45` : 'rgba(255,255,255,0.07)',
              background:  filter === s.key ? `${s.color}0d` : undefined,
            }}>
            <div style={{ fontSize: 18, marginBottom: 3 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: s.color }}>{counts[s.key]}</div>
            <div className="label-sm">{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex gap-2 mb-5">
        {['all', 'valid', 'expiring', 'expired'].map(f => (
          <motion.button key={f} whileTap={{ scale: 0.94 }} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize"
            style={{
              fontFamily: 'DM Sans',
              background: filter === f ? 'rgba(0,188,212,0.14)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter === f ? 'rgba(0,188,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: filter === f ? '#67e8f9' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
            }}>
            {f} ({counts[f] ?? reports.length})
          </motion.button>
        ))}
      </div>

      {/* Report cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((r, i) => (
            <ReportCard key={r.id} report={r} index={i} onDelete={deleteReport} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-card p-12 text-center">
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans', fontSize: 14 }}>
              No {filter !== 'all' ? filter : ''} reports. Tap + to add.
            </div>
          </motion.div>
        )}
      </div>

      {/* Add modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add Medical Report">
        {/* Drag-drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); }}
          className="rounded-xl p-6 text-center mb-4 cursor-pointer"
          style={{
            border: `2px dashed ${dragOver ? '#00bcd4' : 'rgba(255,255,255,0.12)'}`,
            background: dragOver ? 'rgba(0,188,212,0.05)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s',
          }}>
          <Upload size={24} color="rgba(0,188,212,0.55)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'DM Sans' }}>
            Drag & drop PDF / image<br />
            <span style={{ color: '#00bcd4', cursor: 'pointer' }}>or click to browse</span>
          </div>
        </div>

        <div className="mb-3">
          <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>Report Name *</label>
          <input className="input-modern" placeholder="e.g. HbA1c Blood Test"
            value={form.name} onChange={e => setF('name')(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>Issue Date *</label>
            <input type="date" className="input-modern" style={{ colorScheme: 'dark' }}
              value={form.date} onChange={e => setF('date')(e.target.value)} />
          </div>
          <div>
            <label className="label-sm" style={{ display: 'block', marginBottom: 7 }}>Valid for</label>
            <select className="input-modern" value={form.validityDays} onChange={e => setF('validityDays')(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', colorScheme: 'dark' }}>
              {[['30','30 days'],['60','60 days'],['90','90 days'],['180','6 months'],['365','1 year'],['730','2 years']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }} onClick={handleAdd} className="btn-primary w-full py-3">
          Add Report ✓
        </motion.button>
      </Modal>
    </motion.div>
  );
}
