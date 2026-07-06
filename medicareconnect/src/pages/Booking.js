import React, { useState, useEffect } from 'react';
import {
  fetchBookings, createBooking, updateBookingStatus,
  fetchAvailableSlots, fetchDoctors, fetchBookingStats,
} from '../services/bookingService';
import { APPOINTMENT_TYPES, BLOOD_GROUPS } from '../utils/constants';
import { formatDate, formatTime, statusColor } from '../utils/helpers';

const s = {
  page: { padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 800, color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 2px 12px rgba(59,130,246,0.08)' },
  statValue: { fontSize: 26, fontWeight: 800, color: '#1e293b', lineHeight: 1 },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(59,130,246,0.08)' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 18 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: {
    width: '100%', padding: '10px 13px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '10px 13px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  },
  slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 },
  slot: {
    padding: '8px 0', border: '1.5px solid #e2e8f0',
    borderRadius: 8, textAlign: 'center', fontSize: 12,
    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
  },
  submitBtn: {
    width: '100%', padding: 13,
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4,
  },
  bookingItem: {
    display: 'flex', gap: 14, padding: '14px 0',
    borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start',
  },
  timeBlock: {
    background: '#eff6ff', borderRadius: 10, padding: '8px 10px',
    textAlign: 'center', minWidth: 54, flexShrink: 0,
  },
  timeText: { fontSize: 13, fontWeight: 800, color: '#1d4ed8' },
  timePeriod: { fontSize: 10, color: '#3b82f6', marginTop: 1 },
  bookingName: { fontSize: 14, fontWeight: 700, color: '#1e293b' },
  bookingMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  badge: { padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, display: 'inline-block', marginTop: 4 },
  cancelBtn: {
    padding: '3px 10px', background: '#fef2f2',
    border: '1px solid #fecaca', color: '#dc2626',
    borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600,
  },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 },
  success: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', color: '#15803d', fontSize: 13, marginBottom: 16 },
};

const today = new Date().toISOString().split('T')[0];

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    patientName: '', patientId: '', doctorId: '', date: today,
    time: '', type: 'OPD', notes: '',
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBookings({ date: today }), fetchDoctors(), fetchBookingStats()])
      .then(([bk, doc, st]) => { setBookings(bk); setDoctors(doc); setStats(st); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (form.doctorId && form.date) {
      fetchAvailableSlots(form.doctorId, form.date).then(setSlots);
    }
  }, [form.doctorId, form.date]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'time') setForm(prev => ({ ...prev, time: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.patientName || !form.doctorId || !form.date || !form.time) {
      setError('Please fill in all required fields and select a time slot.'); return;
    }
    setLoading(true); setError(''); setSuccess('');
    try {
      const doc = doctors.find(d => d.id === form.doctorId);
      const newBooking = await createBooking({
        ...form,
        doctorName: doc?.name || 'Unknown',
        department: doc?.department || '',
      });
      setBookings(prev => [newBooking, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1, confirmed: prev.confirmed + 1 }));
      setSuccess(`Appointment booked for ${form.patientName} at ${form.time}!`);
      setForm({ patientName: '', patientId: '', doctorId: '', date: today, time: '', type: 'OPD', notes: '' });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    await updateBookingStatus(id, 'cancelled');
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const STAT_DATA = [
    { label: "Today's Bookings", value: stats.today ?? 0, icon: '📅' },
    { label: 'Confirmed', value: stats.confirmed ?? 0, icon: '✅' },
    { label: 'Waiting', value: stats.waiting ?? 0, icon: '⏳' },
    { label: 'Total', value: stats.total ?? 0, icon: '📊' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>📅 Appointment Booking</div>
          <div style={s.subtitle}>Schedule and manage patient appointments</div>
        </div>
      </div>

      <div style={s.statsRow}>
        {STAT_DATA.map(st => (
          <div key={st.label} style={s.statCard}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{st.icon}</div>
            <div style={s.statValue}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={s.grid}>
        {/* Booking form */}
        <div style={s.card}>
          <div style={s.cardTitle}>New Appointment</div>
          {error && <div style={s.error}>⚠️ {error}</div>}
          {success && <div style={s.success}>✅ {success}</div>}
          <form onSubmit={handleSubmit}>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Patient Name *</label>
                <input style={s.input} name="patientName" placeholder="Full name" value={form.patientName} onChange={handleChange} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Patient ID</label>
                <input style={s.input} name="patientId" placeholder="p001" value={form.patientId} onChange={handleChange} />
              </div>
            </div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Doctor *</label>
                <select style={s.select} name="doctorId" value={form.doctorId} onChange={handleChange}>
                  <option value="">Select doctor</option>
                  {doctors.filter(d => d.available).map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.department}</option>
                  ))}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Appointment Type</label>
                <select style={s.select} name="type" value={form.type} onChange={handleChange}>
                  {APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Date *</label>
              <input style={s.input} type="date" name="date" value={form.date} min={today} onChange={handleChange} />
            </div>
            {slots.length > 0 && (
              <div style={s.formGroup}>
                <label style={s.label}>Available Time Slots *</label>
                <div style={s.slotsGrid}>
                  {slots.map(slot => (
                    <div key={slot} style={{
                      ...s.slot,
                      background: form.time === slot ? '#3b82f6' : '#f8fafc',
                      color: form.time === slot ? '#fff' : '#374151',
                      borderColor: form.time === slot ? '#3b82f6' : '#e2e8f0',
                    }}
                      onClick={() => setForm(prev => ({ ...prev, time: slot }))}
                    >{slot}</div>
                  ))}
                </div>
              </div>
            )}
            <div style={s.formGroup}>
              <label style={s.label}>Notes</label>
              <textarea
                style={{ ...s.input, resize: 'vertical', minHeight: 60 }}
                name="notes" placeholder="Additional notes..." value={form.notes} onChange={handleChange}
              />
            </div>
            <button style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Booking…' : '📅 Book Appointment'}
            </button>
          </form>
        </div>

        {/* Today's bookings */}
        <div style={s.card}>
          <div style={s.cardTitle}>Today's Schedule</div>
          {bookings.length === 0 && <div style={{ color: '#94a3b8', textAlign: 'center', padding: 32, fontSize: 13 }}>No appointments today</div>}
          {bookings.map(b => {
            const [h, m] = b.time.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const display = `${hour > 12 ? hour - 12 : hour}:${m}`;
            const sc = statusColor(b.status);
            return (
              <div key={b.id} style={s.bookingItem}>
                <div style={s.timeBlock}>
                  <div style={s.timeText}>{display}</div>
                  <div style={s.timePeriod}>{ampm}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={s.bookingName}>{b.patientName}</div>
                  <div style={s.bookingMeta}>{b.doctorName} · {b.type}</div>
                  <span style={{ ...s.badge, background: sc + '22', color: sc }}>{b.status}</span>
                </div>
                {b.status === 'confirmed' && (
                  <button style={s.cancelBtn} onClick={() => handleCancel(b.id)}>Cancel</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}