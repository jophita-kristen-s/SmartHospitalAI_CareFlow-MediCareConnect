import React from 'react'

export default function Spinner({ size = 24, color = 'var(--primary)', style = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <svg
        width={size} height={size} viewBox="0 0 24 24" fill="none"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function LoadingOverlay({ text = 'Loading...' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(240,244,255,0.7)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 12, zIndex: 9999,
    }}>
      <Spinner size={40} />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</p>
    </div>
  )
}