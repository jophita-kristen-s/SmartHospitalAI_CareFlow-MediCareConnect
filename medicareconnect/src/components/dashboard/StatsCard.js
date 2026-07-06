import React from 'react';

const PRESETS = {
  live: { icon: 'PT', bg: '#FFF7E6', color: '#F59E0B', label: 'Patients waiting' },
  emergency: { icon: 'ER', bg: '#FEF2F2', color: '#EF4444', label: 'Emergency alerts' },
  beds: { icon: 'BD', bg: '#EEF4FF', color: '#2563EB', label: 'Beds available' },
};

export default function StatsCard({ type = 'live', value, label, trend, icon, bgColor, color }) {
  const preset = PRESETS[type] || PRESETS.live;
  const resolvedIcon = icon || preset.icon;
  const resolvedBg = bgColor || preset.bg;
  const resolvedColor = color || preset.color;

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        flex: 1,
        minWidth: 220,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: resolvedBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          flexShrink: 0,
          fontWeight: 800,
          color: resolvedColor,
        }}
      >
        {resolvedIcon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>
          {label || preset.label}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
        {typeof trend === 'number' && (
          <div style={{ fontSize: 11, color: trend > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 2 }}>
            {trend > 0 ? 'Up' : 'Down'} {Math.abs(trend)}% vs last hour
          </div>
        )}
      </div>
    </div>
  );
}
