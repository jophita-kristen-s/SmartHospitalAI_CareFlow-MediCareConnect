import React, { useState } from 'react'
import { useEmergency } from '../../context/EmergencyContext'
import Button from '../common/Button'

function VitalBadge({ value, color }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, flexShrink: 0,
    }}>{value}</div>
  )
}

const SEVERITY_COLOR = { critical: '#EF4444', high: '#F59E0B', medium: '#4F8EF7', low: '#22C55E' }

function CaseRow({ c, onAccept, onReject }) {
  const [loading, setLoading] = useState(false)

  const handle = async (action) => {
    setLoading(true)
    try { await action() } finally { setLoading(false) }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, color: 'var(--primary)', fontSize: 13,
      }}>
        {c.name.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{c.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
            background: SEVERITY_COLOR[c.severity] || 'var(--primary)',
          }} />
          {c.condition}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <VitalBadge value={c.heartRate} color="#22C55E" />
        <VitalBadge value={c.bloodPressure} color="#4F8EF7" />
      </div>
    </div>
  )
}

export default function EmergencyPanel({ onAccept, onReject }) {
  const { cases, acceptCase, rejectCase, liveCount } = useEmergency()
  const [tab, setTab] = useState('realtime')
  const incoming = cases.filter(c => c.status === 'incoming')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['realtime', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            background: tab === t ? 'var(--emergency)' : 'var(--surface-2)',
            color: tab === t ? '#fff' : 'var(--text-secondary)',
          }}>
            {t === 'realtime' ? '🔴 Real-Time' : 'Ral-Time'}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)',
      }}>
        <span>Incoming Cases</span>
        <span style={{ fontWeight: 700, color: 'var(--emergency)' }}>{incoming.length}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {incoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>
            No incoming cases
          </div>
        ) : (
          incoming.slice(0, 3).map(c => (
            <CaseRow key={c.id} c={c} onAccept={() => acceptCase(c.id)} onReject={() => rejectCase(c.id)} />
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <Button variant="success" size="sm" style={{ flex: 1 }}
          onClick={() => incoming[0] && acceptCase(incoming[0].id)}>
          ✓ Accept
        </Button>
        <Button variant="danger" size="sm" style={{ flex: 1 }}
          onClick={() => incoming[0] && rejectCase(incoming[0].id)}>
          ✕ Reject
        </Button>
      </div>
    </div>
  )
}