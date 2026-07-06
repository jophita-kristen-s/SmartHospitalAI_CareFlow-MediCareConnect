import React, { useState } from 'react';
import { fetchPatientById } from '../services/patientService';
import { statusColor, formatDate } from '../utils/helpers';

const s = {
  page: { padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  title: { fontSize: 22, fontWeight: 800, color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 28 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  card: { background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 16px rgba(59,130,246,0.08)' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 18 },
  qrBox: {
    border: '2px dashed #bfdbfe', borderRadius: 16, padding: 40,
    textAlign: 'center', background: '#f0f9ff', cursor: 'pointer',
    transition: 'border-color 0.2s',
    position: 'relative', overflow: 'hidden',
  },
  qrIcon: { fontSize: 48, marginBottom: 14, fontWeight: 800, color: '#1d4ed8' },
  qrText: { fontSize: 15, fontWeight: 600, color: '#1d4ed8', marginBottom: 6 },
  qrSub: { fontSize: 13, color: '#64748b' },
  manualSection: { marginTop: 24 },
  inputRow: { display: 'flex', gap: 10 },
  input: {
    flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: 10, fontSize: 13, outline: 'none', background: '#f8fafc',
  },
  searchBtn: {
    padding: '11px 20px', background: '#3b82f6', color: '#fff',
    border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  recentCard: {
    display: 'flex', gap: 12, padding: '14px 0',
    borderBottom: '1px solid #f1f5f9', alignItems: 'center', cursor: 'pointer',
  },
  avatar: {
    width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
  },
  patientCard: {
    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    border: '1px solid #bfdbfe', borderRadius: 16, padding: 24,
  },
  patientName: { fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 4 },
  metaRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  metaBadge: {
    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: '#fff', border: '1px solid #e2e8f0', color: '#374151',
  },
  vitalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 },
  vitalCard: {
    background: '#fff', borderRadius: 10, padding: '12px 14px', textAlign: 'center',
    boxShadow: '0 1px 6px rgba(59,130,246,0.08)',
  },
  vitalVal: { fontSize: 18, fontWeight: 800, color: '#1e293b' },
  vitalLabel: { fontSize: 10, color: '#94a3b8', marginTop: 2, fontWeight: 500 },
  infoSection: { background: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f8fafc', fontSize: 13 },
  actionRow: { display: 'flex', gap: 10, marginTop: 16 },
  actionBtn: {
    flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
    cursor: 'pointer', border: 'none',
  },
  empty: { textAlign: 'center', padding: 40, color: '#94a3b8' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 14, color: '#dc2626', fontSize: 13, marginTop: 14 },
  scanning: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' },
};

const AVATARS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
const avatarColor = (name = '') => AVATARS[Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % AVATARS.length];
const initials = (name = '') => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const RECENT_SCANS = [
  { id: 'p001', name: 'Richard Davis', time: '2 mins ago', ward: 'General' },
  { id: 'p005', name: 'John Doe', time: '15 mins ago', ward: 'ICU' },
  { id: 'p002', name: 'Sarah Miller', time: '1 hour ago', ward: 'ICU' },
];

function QRDisplay({ patientId }) {
  const cells = [];
  for (let r = 0; r < 21; r += 1) {
    for (let c = 0; c < 21; c += 1) {
      const isCorner = (r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7);
      const filled = isCorner || Math.sin(r * 7 + c * 13 + patientId.charCodeAt(0)) > 0;
      if (filled) cells.push({ r, c });
    }
  }

  return (
    <svg viewBox="0 0 23 23" width={160} height={160} style={{ display: 'block', margin: '0 auto' }}>
      <rect width={23} height={23} fill="#fff" />
      {cells.map(({ r, c }) => (
        <rect key={`${r}-${c}`} x={c + 1} y={r + 1} width={0.9} height={0.9} fill="#1e293b" />
      ))}
    </svg>
  );
}

export default function QRPage() {
  const [searchId, setSearchId] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const lookupPatient = async (id) => {
    const pid = (id || searchId).trim();
    if (!pid) return;

    setLoading(true);
    setError('');
    setPatient(null);

    try {
      const record = await fetchPatientById(pid);
      setPatient(record);
    } catch {
      setError(`Patient "${pid}" not found. Try: p001, p002, p003, p004, p005`);
    } finally {
      setLoading(false);
    }
  };

  const simulateScan = () => {
    setScanning(true);
    const ids = ['p001', 'p002', 'p003', 'p004', 'p005'];
    const randomId = ids[Math.floor(Math.random() * ids.length)];

    setTimeout(() => {
      setScanning(false);
      lookupPatient(randomId);
    }, 2000);
  };

  return (
    <div style={s.page}>
      <div style={s.title}>QR Scanner</div>
      <div style={s.subtitle}>Scan patient QR codes for instant record access</div>

      <div style={s.grid}>
        <div>
          <div style={s.card}>
            <div style={s.cardTitle}>Scan QR Code</div>
            <div style={s.qrBox} onClick={!scanning ? simulateScan : undefined}>
              {scanning && (
                <div style={s.scanning}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>...</div>
                    <div style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600, marginTop: 8 }}>Scanning...</div>
                  </div>
                </div>
              )}
              <div style={s.qrIcon}>QR</div>
              <div style={s.qrText}>Click to Simulate Scan</div>
              <div style={s.qrSub}>Or use camera to scan a patient QR code</div>
            </div>

            <div style={s.manualSection}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Manual Patient ID Lookup</div>
              <div style={s.inputRow}>
                <input
                  style={s.input}
                  placeholder="Enter Patient ID (e.g. p001)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && lookupPatient()}
                />
                <button style={{ ...s.searchBtn, opacity: loading ? 0.7 : 1 }} onClick={() => lookupPatient()} disabled={loading}>
                  {loading ? '...' : 'Search'}
                </button>
              </div>
              {error && <div style={s.error}>Error: {error}</div>}
            </div>
          </div>

          <div style={{ ...s.card, marginTop: 20 }}>
            <div style={s.cardTitle}>Recent Scans</div>
            {RECENT_SCANS.map((record) => (
              <div key={record.id} style={s.recentCard} onClick={() => lookupPatient(record.id)}>
                <div style={{ ...s.avatar, background: avatarColor(record.name) }}>{initials(record.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{record.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{record.id} | {record.ward}</div>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{record.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Patient Information</div>

          {!patient && !loading && (
            <div style={s.empty}>
              <div style={{ fontSize: 48, marginBottom: 12, fontWeight: 700 }}>ID</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No patient selected</div>
              <div style={{ fontSize: 12 }}>Scan a QR code or search by Patient ID</div>
            </div>
          )}

          {patient && (
            <>
              <div style={s.patientCard}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ ...s.avatar, background: avatarColor(patient.name), width: 56, height: 56, fontSize: 18 }}>
                    {initials(patient.name)}
                  </div>
                  <div>
                    <div style={s.patientName}>{patient.name}</div>
                    <div style={s.metaRow}>
                      {[`${patient.age}y`, patient.gender, patient.bloodGroup, patient.ward].map((meta) => (
                        <span key={meta} style={s.metaBadge}>{meta}</span>
                      ))}
                    </div>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        background: `${statusColor(patient.status)}22`,
                        color: statusColor(patient.status),
                      }}
                    >
                      {patient.status}
                    </span>
                  </div>
                </div>

                <div style={s.vitalsGrid}>
                  {[
                    ['BP', patient.vitals?.bp],
                    ['Pulse', patient.vitals?.pulse ? `${patient.vitals.pulse} bpm` : 'N/A'],
                    ['SpO2', patient.vitals?.spo2 ? `${patient.vitals.spo2}%` : 'N/A'],
                    ['Temp', patient.vitals?.temp ? `${patient.vitals.temp} F` : 'N/A'],
                  ].map(([label, value]) => (
                    <div key={label} style={s.vitalCard}>
                      <div style={s.vitalVal}>{value || 'N/A'}</div>
                      <div style={s.vitalLabel}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...s.infoSection, marginTop: 16 }}>
                {[
                  ['Diagnosis', patient.diagnosis],
                  ['Doctor', patient.doctor],
                  ['Room', patient.room || 'N/A'],
                  ['Admitted', formatDate(patient.admittedAt)],
                  ['Patient ID', patient.id],
                ].map(([label, value]) => (
                  <div key={label} style={s.infoRow}>
                    <span style={{ color: '#94a3b8', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', margin: '16px 0 10px' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, fontWeight: 600 }}>Patient QR Code</div>
                <div style={{ border: '2px solid #e2e8f0', borderRadius: 12, display: 'inline-block', padding: 12 }}>
                  <QRDisplay patientId={patient.id} />
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>{patient.id}</div>
              </div>

              <div style={s.actionRow}>
                <button style={{ ...s.actionBtn, background: '#eff6ff', color: '#3b82f6' }}>View Full Record</button>
                <button style={{ ...s.actionBtn, background: '#f0fdf4', color: '#059669' }}>Prescriptions</button>
                <button style={{ ...s.actionBtn, background: '#fef9c3', color: '#854d0e' }}>Update Vitals</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
