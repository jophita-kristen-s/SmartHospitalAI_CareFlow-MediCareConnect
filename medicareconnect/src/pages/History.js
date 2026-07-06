import React, { useState, useEffect } from 'react';
import { fetchPatients } from '../services/patientService';
import { fetchBookings } from '../services/bookingService';
import { fetchEmergencyCases } from '../services/emergencyService';
import { formatDate, formatTime, timeAgo, statusColor, severityColor } from '../utils/helpers';

const s = {
  page: { padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 800, color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  filters: {
    display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center',
  },
  filterBtn: {
    padding: '8px 16px', border: '1.5px solid #e2e8f0',
    borderRadius: 20, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s', background: '#fff',
  },
  searchInput: {
    padding: '9px 16px', border: '1.5px solid #e2e8f0',
    borderRadius: 20, fontSize: 13, background: '#f8fafc',
    outline: 'none', width: 220,
  },
  dateInput: {
    padding: '8px 12px', border: '1.5px solid #e2e8f0',
    borderRadius: 20, fontSize: 12, background: '#f8fafc', outline: 'none',
  },
  table: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(59,130,246,0.08)',
  },
  thead: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: {
    padding: '13px 18px', textAlign: 'left', fontSize: 11,
    fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px',
  },
  td: { padding: '14px 18px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f1f5f9' },
  badge: {
    padding: '3px 10px', borderRadius: 20, fontSize: 11,
    fontWeight: 700, display: 'inline-block',
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#fff', marginRight: 10,
    flexShrink: 0, verticalAlign: 'middle',
  },
  typeIcon: { marginRight: 6 },
  empty: { textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 },
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #f1f5f9', background: '#fff' },
  pageBtn: { padding: '6px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fff' },
};

const AVATARS = ['#3b82f6','#8b5cf6','#ec4899','#10b981','#f59e0b','#ef4444'];
const avatarColor = name => AVATARS[Math.abs([...name].reduce((a,c) => a + c.charCodeAt(0), 0)) % AVATARS.length];
const initials = name => name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();

const TYPE_CONFIG = {
  admission: { icon: '🏥', label: 'Admission', bg: '#eff6ff', text: '#1d4ed8' },
  booking: { icon: '📅', label: 'Appointment', bg: '#f0fdf4', text: '#15803d' },
  emergency: { icon: '🚨', label: 'Emergency', bg: '#fef2f2', text: '#dc2626' },
  discharge: { icon: '✅', label: 'Discharge', bg: '#f0fdf4', text: '#059669' },
};

export default function History() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPatients(),
      fetchBookings(),
      fetchEmergencyCases(),
    ]).then(([pRes, bookings, emergency]) => {
      const patients = pRes.patients || pRes;
      const combined = [
        ...patients.map(p => ({
          id: `adm-${p.id}`, type: 'admission', patientName: p.name,
          detail: p.diagnosis, doctor: p.doctor, date: p.admittedAt,
          status: p.status, ward: p.ward,
        })),
        ...bookings.map(b => ({
          id: `bk-${b.id}`, type: 'booking', patientName: b.patientName,
          detail: `${b.type} with ${b.doctorName}`, doctor: b.doctorName,
          date: `${b.date}T${b.time}:00Z`, status: b.status, ward: b.department,
        })),
        ...emergency.map(e => ({
          id: `em-${e.id}`, type: 'emergency', patientName: e.patientName,
          detail: e.condition, doctor: e.assignedTo || 'Unassigned',
          date: e.arrivalTime, status: e.status, ward: 'Emergency',
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecords(combined);
      setFiltered(combined);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...records];
    if (typeFilter !== 'all') result = result.filter(r => r.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.patientName.toLowerCase().includes(q) || r.detail.toLowerCase().includes(q) || r.doctor?.toLowerCase().includes(q));
    }
    if (dateFilter) result = result.filter(r => r.date.startsWith(dateFilter));
    setFiltered(result);
    setPage(1);
  }, [records, search, typeFilter, dateFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const FILTERS = [
    { key: 'all', label: `All (${records.length})` },
    { key: 'admission', label: '🏥 Admissions' },
    { key: 'booking', label: '📅 Appointments' },
    { key: 'emergency', label: '🚨 Emergency' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>📋 History & Audit Trail</div>
        <div style={s.subtitle}>Complete record of all patient interactions and events</div>
      </div>

      <div style={s.filters}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            style={{
              ...s.filterBtn,
              background: typeFilter === f.key ? '#3b82f6' : '#fff',
              color: typeFilter === f.key ? '#fff' : '#374151',
              borderColor: typeFilter === f.key ? '#3b82f6' : '#e2e8f0',
            }}
            onClick={() => setTypeFilter(f.key)}
          >{f.label}</button>
        ))}
        <input
          style={s.searchInput}
          placeholder="🔍 Search patient, doctor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input style={s.dateInput} type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        {(search || dateFilter) && (
          <button style={{ ...s.filterBtn, color: '#ef4444', borderColor: '#fecaca' }}
            onClick={() => { setSearch(''); setDateFilter(''); }}>
            ✕ Clear
          </button>
        )}
      </div>

      <div style={s.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={s.thead}>
            <tr>
              {['Type', 'Patient', 'Details', 'Doctor / Assigned', 'Ward', 'Date & Time', 'Status'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={s.empty}>Loading…</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={7} style={s.empty}>No records found</td></tr>
            ) : paginated.map(r => {
              const tc = TYPE_CONFIG[r.type] || TYPE_CONFIG.admission;
              const sc = statusColor(r.status);
              return (
                <tr key={r.id}>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: tc.bg, color: tc.text }}>
                      {tc.icon} {tc.label}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.avatar, background: avatarColor(r.patientName) }}>{initials(r.patientName)}</span>
                    <span style={{ fontWeight: 600 }}>{r.patientName}</span>
                  </td>
                  <td style={{ ...s.td, color: '#64748b', maxWidth: 180 }}>{r.detail}</td>
                  <td style={s.td}>{r.doctor || '—'}</td>
                  <td style={s.td}>{r.ward || '—'}</td>
                  <td style={{ ...s.td, whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600 }}>{formatDate(r.date)}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{timeAgo(r.date)}</div>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: sc + '22', color: sc }}>{r.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={s.pagination}>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Showing {((page-1)*perPage)+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={s.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#374151' }}>{page} / {totalPages}</span>
              <button style={s.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}