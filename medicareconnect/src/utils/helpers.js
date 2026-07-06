/**
 * Utility / helper functions for HospitalCare Flow
 */

// ─── Async ──────────────────────────────────────────────────────────────────
export const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ─── ID generation ──────────────────────────────────────────────────────────
export function generateId(prefix = '') {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`;
}

// ─── Date / Time ────────────────────────────────────────────────────────────

/**
 * Format a Date object or ISO string.
 * Tokens: YYYY, MM, DD, HH, mm, ss
 */
export function formatDate(date, format = 'DD/MM/YYYY') {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '—';
  const pad = n => String(n).padStart(2, '0');
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
}

/** Returns "2 hours ago", "just now", etc. */
export function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

/** Returns "10:30 AM" from ISO string */
export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

/** Whether a date is today */
export function isToday(dateString) {
  const d = new Date(dateString);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

/** Duration in HH:mm from two ISO strings */
export function getDuration(start, end) {
  const ms = new Date(end) - new Date(start);
  if (ms < 0) return '—';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─── String ──────────────────────────────────────────────────────────────────
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str, max = 40) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max) + '…';
}

export function initials(name = '') {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

// ─── Numbers ─────────────────────────────────────────────────────────────────
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function percentage(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

// ─── Object / Array ──────────────────────────────────────────────────────────
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const g = typeof key === 'function' ? key(item) : item[key];
    (acc[g] = acc[g] || []).push(item);
    return acc;
  }, {});
}

export function sortBy(arr, key, dir = 'asc') {
  return [...arr].sort((a, b) => {
    const av = typeof key === 'function' ? key(a) : a[key];
    const bv = typeof key === 'function' ? key(b) : b[key];
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

export function uniqueBy(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const v = item[key];
    if (seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}

// ─── Validation ──────────────────────────────────────────────────────────────
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) =>
  /^\+?[\d\s\-().]{7,20}$/.test(phone);

export const isStrongPassword = (password) =>
  password.length >= 8;

// ─── Color utils ─────────────────────────────────────────────────────────────

/** Map severity/priority to a CSS color token */
export function severityColor(severity) {
  const map = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#10b981',
    normal: '#10b981',
  };
  return map[severity?.toLowerCase()] || '#64748b';
}

export function statusColor(status) {
  const map = {
    admitted: '#3b82f6',
    discharged: '#10b981',
    outpatient: '#8b5cf6',
    pending: '#f59e0b',
    confirmed: '#10b981',
    cancelled: '#ef4444',
    waiting: '#f59e0b',
    completed: '#64748b',
  };
  return map[status?.toLowerCase()] || '#64748b';
}

// ─── Local storage helpers ───────────────────────────────────────────────────
export function getLS(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeLS(key) {
  try { localStorage.removeItem(key); } catch {}
}