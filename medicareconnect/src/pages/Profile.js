import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, changePassword } from '../services/authService';
import { DEPARTMENTS, ROLES } from '../utils/constants';
import { initials } from '../utils/helpers';

const s = {
  page: { padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 1000, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 800, color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 28 },
  grid: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(59,130,246,0.08)' },
  profileCenter: { textAlign: 'center', marginBottom: 24 },
  avatarLarge: {
    width: 90, height: 90, borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 32, fontWeight: 800, color: '#fff',
    margin: '0 auto 14px',
    boxShadow: '0 6px 20px rgba(59,130,246,0.3)',
  },
  userName: { fontSize: 18, fontWeight: 800, color: '#1e293b' },
  userRole: { fontSize: 13, color: '#64748b', marginTop: 2 },
  userDept: { fontSize: 12, color: '#3b82f6', fontWeight: 600, marginTop: 4 },
  infoRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 },
  infoIcon: { fontSize: 16, width: 24 },
  infoLabel: { color: '#94a3b8', fontSize: 11, fontWeight: 600 },
  infoValue: { color: '#374151', fontWeight: 500 },
  logoutBtn: {
    width: '100%', marginTop: 20, padding: '11px', background: '#fef2f2',
    border: '1px solid #fecaca', color: '#dc2626',
    borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  tabRow: { display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid #f1f5f9', paddingBottom: 0 },
  tab: {
    padding: '10px 18px', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', border: 'none', background: 'none',
    borderBottom: '2px solid transparent', marginBottom: -2,
    transition: 'all 0.15s',
  },
  formGroup: { marginBottom: 18 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: {
    width: '100%', padding: '11px 13px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '11px 13px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
  saveBtn: {
    padding: '11px 28px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  success: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', color: '#15803d', fontSize: 13, marginBottom: 16 },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 18 },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' },
  toggleLabel: { fontSize: 13, color: '#374151', fontWeight: 500 },
  toggleSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
};

const Toggle = ({ on, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
      background: on ? '#3b82f6' : '#e2e8f0', position: 'relative', transition: 'background 0.2s',
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    }} />
  </div>
);

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    specialization: user?.specialization || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [prefs, setPrefs] = useState({ emailAlerts: true, smsAlerts: false, emergencyPush: true, weeklySummary: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const saveProfile = async () => {
    setSaving(true); setMsg({ type: '', text: '' });
    try {
      await updateUserProfile(user.id, profileForm);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirm) { setMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    if (pwForm.newPassword.length < 8) { setMsg({ type: 'error', text: 'Password must be at least 8 characters.' }); return; }
    setSaving(true); setMsg({ type: '', text: '' });
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally { setSaving(false); }
  };

  const TABS = [
    { key: 'profile', label: '👤 Profile' },
    { key: 'security', label: '🔒 Security' },
    { key: 'preferences', label: '⚙️ Preferences' },
  ];

  return (
    <div style={s.page}>
      <div style={s.title}>My Profile</div>
      <div style={s.subtitle}>Manage your account details and preferences</div>

      <div style={s.grid}>
        {/* Sidebar */}
        <div style={s.card}>
          <div style={s.profileCenter}>
            <div style={s.avatarLarge}>{(user?.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>
            <div style={s.userName}>{user?.name}</div>
            <div style={s.userRole}>{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</div>
            <div style={s.userDept}>{user?.department}</div>
          </div>
          <div>
            {[
              { icon: '✉️', label: 'Email', value: user?.email },
              { icon: '📞', label: 'Phone', value: user?.phone || 'Not set' },
              { icon: '🏥', label: 'Department', value: user?.department },
              { icon: '🩺', label: 'Specialization', value: user?.specialization || 'General' },
              { icon: '🆔', label: 'User ID', value: user?.id },
            ].map(item => (
              <div key={item.label} style={s.infoRow}>
                <span style={s.infoIcon}>{item.icon}</span>
                <div>
                  <div style={s.infoLabel}>{item.label}</div>
                  <div style={s.infoValue}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={s.logoutBtn} onClick={logout}>🚪 Sign Out</button>
        </div>

        {/* Main content */}
        <div style={s.card}>
          <div style={s.tabRow}>
            {TABS.map(t => (
              <button key={t.key} style={{
                ...s.tab,
                color: tab === t.key ? '#3b82f6' : '#64748b',
                borderBottomColor: tab === t.key ? '#3b82f6' : 'transparent',
              }} onClick={() => { setTab(t.key); setMsg({ type: '', text: '' }); }}>
                {t.label}
              </button>
            ))}
          </div>

          {msg.text && <div style={msg.type === 'success' ? s.success : s.error}>{msg.type === 'success' ? '✅' : '⚠️'} {msg.text}</div>}

          {tab === 'profile' && (
            <>
              <div style={s.sectionTitle}>Personal Information</div>
              <div style={s.grid2}>
                <div style={s.formGroup}>
                  <label style={s.label}>Full Name</label>
                  <input style={s.input} value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Email Address</label>
                  <input style={s.input} type="email" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Phone Number</label>
                  <input style={s.input} value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 555-0000" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Specialization</label>
                  <input style={s.input} value={profileForm.specialization} onChange={e => setProfileForm(p => ({ ...p, specialization: e.target.value }))} placeholder="e.g. Cardiologist" />
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Department</label>
                <select style={s.select} value={profileForm.department} onChange={e => setProfileForm(p => ({ ...p, department: e.target.value }))}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={saveProfile} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save Changes'}
              </button>
            </>
          )}

          {tab === 'security' && (
            <>
              <div style={s.sectionTitle}>Change Password</div>
              {['currentPassword', 'newPassword', 'confirm'].map((field, i) => (
                <div key={field} style={s.formGroup}>
                  <label style={s.label}>{['Current Password', 'New Password', 'Confirm New Password'][i]}</label>
                  <input
                    style={s.input} type="password"
                    placeholder={['Enter current password', 'Min. 8 characters', 'Repeat new password'][i]}
                    value={pwForm[field]}
                    onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <button style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={savePassword} disabled={saving}>
                {saving ? 'Saving…' : '🔒 Update Password'}
              </button>
            </>
          )}

          {tab === 'preferences' && (
            <>
              <div style={s.sectionTitle}>Notification Preferences</div>
              {[
                { key: 'emailAlerts', label: 'Email Alerts', sub: 'Receive patient updates via email' },
                { key: 'smsAlerts', label: 'SMS Alerts', sub: 'Get text message notifications' },
                { key: 'emergencyPush', label: 'Emergency Push Notifications', sub: 'Immediate alerts for critical cases' },
                { key: 'weeklySummary', label: 'Weekly Summary Report', sub: 'Weekly digest of your patient activity' },
              ].map(item => (
                <div key={item.key} style={s.toggleRow}>
                  <div>
                    <div style={s.toggleLabel}>{item.label}</div>
                    <div style={s.toggleSub}>{item.sub}</div>
                  </div>
                  <Toggle on={prefs[item.key]} onChange={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))} />
                </div>
              ))}
              <button style={{ ...s.saveBtn, marginTop: 24 }}>💾 Save Preferences</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}