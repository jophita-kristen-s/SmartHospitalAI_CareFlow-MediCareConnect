import React, { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { formatTime, timeAgo, severityColor } from '../utils/helpers';

const s = {
  page: { padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 800, color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  alertBanner: {
    background: 'linear-gradient(135deg, #fef2f2, #ffe4e6)',
    border: '1px solid #fecaca', borderRadius: 14,
    padding: '14px 20px', marginBottom: 20,
    display: 'flex', alignItems: 'center', gap: 12,
  },
  alertDot: { width: 10, height: 10, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' },
  alertText: { fontSize: 14, fontWeight: 600, color: '#dc2626' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: {
    background: '#fff', borderRadius: 14, padding: '18px 20px',
    boxShadow: '0 2px 12px rgba(59,130,246,0.08)',
  },
  statIcon: { fontSize: 22, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 1 },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 },
  card: {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 16px rgba(59,130,246,0.08)',
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  caseCard: {
    border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '16px 18px',
    marginBottom: 12, cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  caseHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  patientInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700, flexShrink: 0, color: '#fff',
  },
  patientName: { fontSize: 15, fontWeight: 700, color: '#1e293b' },
  patientMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  badge: {
    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  vitalsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 },
  vitalBox: {
    background: '#f8fafc', borderRadius: 8, padding: '8px 10px', textAlign: 'center',
  },
  vitalValue: { fontSize: 14, fontWeight: 700, color: '#1e293b' },
  vitalLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 500 },
  actionRow: { display: 'flex', gap: 10 },
  acceptBtn: {
    flex: 1, padding: '9px 0', background: '#10b981', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  rejectBtn: {
    flex: 1, padding: '9px 0', background: '#ef4444', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  statusBadge: {
    padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
    display: 'inline-block', marginTop: 8,
  },
  alertItem: {
    display: 'flex', gap: 12, padding: '14px 0',
    borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start',
  },
  alertIcon: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, flexShrink: 0,
  },
  resolveBtn: {
    marginTop: 4, padding: '4px 10px', background: '#eff6ff',
    border: '1px solid #bfdbfe', color: '#3b82f6', borderRadius: 6,
    fontSize: 11, fontWeight: 600, cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: 40, color: '#94a3b8' },
};

const SEVERITY_COLORS = {
  critical: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  high: { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  medium: { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
  low: { bg: '#f0fdf4', text: '#15803d', dot: '#10b981' },
};

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name = '') {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function Emergency() {
  const { cases, alerts, stats, acceptCase, rejectCase, resolveAlert, loading } = useEmergency();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(null);

  const pending = cases.filter(c => c.status === 'pending');
  const accepted = cases.filter(c => c.status === 'accepted');

  const STATS = [
    { icon: '⏳', label: 'Waiting', value: stats.waiting, color: '#f59e0b' },
    { icon: '✅', label: 'Accepted', value: stats.accepted, color: '#10b981' },
    { icon: '🚨', label: 'Critical', value: stats.critical, color: '#ef4444' },
    { icon: '🔔', label: 'Alerts', value: stats.alerts, color: '#8b5cf6' },
  ];

  const ALERT_ICONS = { code_blue: { bg: '#eff6ff', icon: '🔵' }, ambulance: { bg: '#fef9c3', icon: '🚑' }, equipment: { bg: '#f0fdf4', icon: '🔧' }, default: { bg: '#fdf4ff', icon: '⚠️' } };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>🚨 Emergency Panel</div>
          <div style={s.subtitle}>Real-time incoming emergency cases and alerts</div>
        </div>
        <div style={{ fontSize: 13, color: '#64748b', background: '#f1f5f9', padding: '8px 16px', borderRadius: 20 }}>
          🟢 Live · {new Date().toLocaleTimeString()}
        </div>
      </div>

      {alerts.length > 0 && (
        <div style={s.alertBanner}>
          <div style={s.alertDot} />
          <div style={s.alertText}>🔔 {alerts.length} active alert{alerts.length > 1 ? 's' : ''}: {alerts[0]?.message}</div>
        </div>
      )}

      <div style={s.statsRow}>
        {STATS.map(st => (
          <div key={st.label} style={s.statCard}>
            <div style={s.statIcon}>{st.icon}</div>
            <div style={{ ...s.statValue, color: st.color }}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={s.grid}>
        {/* Cases list */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <span style={{ background: '#fef2f2', padding: '4px 10px', borderRadius: 8, fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
              PENDING
            </span>
            Incoming Cases ({pending.length})
          </div>
          {pending.length === 0 && <div style={s.empty}>✅ No pending emergency cases</div>}
          {pending.map(c => {
            const sev = SEVERITY_COLORS[c.severity] || SEVERITY_COLORS.medium;
            const color = getAvatarColor(c.patientName);
            return (
              <div
                key={c.id}
                style={{ ...s.caseCard, borderColor: selectedId === c.id ? '#3b82f6' : '#e2e8f0', boxShadow: selectedId === c.id ? '0 0 0 3px #dbeafe' : 'none' }}
                onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
              >
                <div style={s.caseHeader}>
                  <div style={s.patientInfo}>
                    <div style={{ ...s.avatar, background: color }}>{initials(c.patientName)}</div>
                    <div>
                      <div style={s.patientName}>{c.patientName}</div>
                      <div style={s.patientMeta}>{c.age}y · {c.gender} · {c.condition}</div>
                    </div>
                  </div>
                  <div>
                    <span style={{ ...s.badge, background: sev.bg, color: sev.text }}>
                      {c.severity}
                    </span>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>{timeAgo(c.arrivalTime)}</div>
                  </div>
                </div>
                <div style={s.vitalsRow}>
                  {[['BP', c.vitals?.bp], ['Pulse', c.vitals?.pulse], ['SpO2', `${c.vitals?.spo2}%`], ['Triage', c.triageScore]].map(([label, val]) => (
                    <div key={label} style={s.vitalBox}>
                      <div style={s.vitalValue}>{val ?? '—'}</div>
                      <div style={s.vitalLabel}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={s.actionRow}>
                  <button style={s.acceptBtn} onClick={(e) => { e.stopPropagation(); acceptCase(c.id, user?.name); }}>
                    ✓ Accept
                  </button>
                  <button style={s.rejectBtn} onClick={(e) => { e.stopPropagation(); rejectCase(c.id); }}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            );
          })}

          {/* Accepted cases */}
          {accepted.length > 0 && (
            <>
              <div style={{ ...s.cardTitle, marginTop: 24, marginBottom: 12 }}>
                <span style={{ background: '#f0fdf4', padding: '4px 10px', borderRadius: 8, fontSize: 12, color: '#15803d', fontWeight: 700 }}>
                  ACCEPTED
                </span>
                In Treatment ({accepted.length})
              </div>
              {accepted.map(c => (
                <div key={c.id} style={{ ...s.caseCard, background: '#f9fafb', cursor: 'default' }}>
                  <div style={s.patientInfo}>
                    <div style={{ ...s.avatar, background: getAvatarColor(c.patientName), width: 36, height: 36, fontSize: 13 }}>
                      {initials(c.patientName)}
                    </div>
                    <div>
                      <div style={{ ...s.patientName, fontSize: 14 }}>{c.patientName}</div>
                      <div style={s.patientMeta}>{c.condition} · Assigned to {c.assignedTo}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Alerts */}
        <div style={s.card}>
          <div style={s.cardTitle}>🔔 Active Alerts</div>
          {alerts.length === 0 && <div style={s.empty}>No active alerts</div>}
          {alerts.map(a => {
            const ai = ALERT_ICONS[a.type] || ALERT_ICONS.default;
            return (
              <div key={a.id} style={s.alertItem}>
                <div style={{ ...s.alertIcon, background: ai.bg }}>{ai.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{a.message}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{timeAgo(a.time)}</div>
                  <button style={s.resolveBtn} onClick={() => resolveAlert(a.id)}>Resolve</button>
                </div>
              </div>
            );
          })}

          {/* Ambulance tracker */}
          <div style={{ marginTop: 20 }}>
            <div style={{ ...s.cardTitle, fontSize: 14, marginBottom: 12 }}>🚑 Ambulance Status</div>
            {['AMB-01', 'AMB-02', 'AMB-03'].map((amb, i) => (
              <div key={amb} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{amb}</div>
                <span style={{
                  ...s.badge,
                  background: i === 0 ? '#fef9c3' : i === 1 ? '#f0fdf4' : '#f1f5f9',
                  color: i === 0 ? '#854d0e' : i === 1 ? '#15803d' : '#475569',
                }}>
                  {i === 0 ? '🔴 En Route' : i === 1 ? '🟢 Available' : '⚪ Standby'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}