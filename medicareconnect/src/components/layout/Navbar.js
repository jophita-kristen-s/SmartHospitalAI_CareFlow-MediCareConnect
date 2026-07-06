import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ title = '' }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const now = new Date()
  const month = now.toLocaleString('default', { month: 'short' })

  return (
    <header style={{
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)',
    }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>{title}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Month badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          borderRadius: 20, background: 'var(--surface-2)', border: '1px solid var(--border)',
          fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
        }}>
          🔔 {month}
        </div>

        {/* Globe */}
        <button style={{
          width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
          background: 'var(--surface-2)', cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🌐</button>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(79,142,247,0.3)',
        }}>
          {user?.name?.slice(0, 2).toUpperCase() || 'DR'}
        </div>
      </div>
    </header>
  )
}