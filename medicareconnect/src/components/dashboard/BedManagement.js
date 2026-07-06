import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useBeds } from '../../context/BedContext'
import Button from '../common/Button'

export default function BedManagement() {
  const { stats } = useBeds()

  const icuData = [
    { name: 'Occupied',  value: stats.icu.occupied },
    { name: 'Available', value: stats.icu.total - stats.icu.occupied },
  ]
  const genData = [
    { name: 'Occupied',  value: stats.general.occupied },
    { name: 'Available', value: stats.general.total - stats.general.occupied },
  ]

  const totalOccupied  = stats.icu.occupied + stats.general.occupied
  const totalAvailable = (stats.icu.total - stats.icu.occupied) + (stats.general.total - stats.general.occupied)

  const chartData = [
    { name: 'ICU Occupied',       value: stats.icu.occupied,                          color: '#4F8EF7' },
    { name: 'ICU Available',      value: stats.icu.total - stats.icu.occupied,        color: '#93C5FD' },
    { name: 'General Occupied',   value: stats.general.occupied,                      color: '#22C55E' },
    { name: 'General Available',  value: stats.general.total - stats.general.occupied, color: '#86EFAC' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>🏥 ICU & General</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        {/* Donut chart */}
        <div style={{ width: 100, height: 100, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" paddingAngle={2}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div style={{ flex: 1 }}>
          <StatRow label="ICU Genca B" total={stats.icu.total} occupied={stats.icu.occupied} color="#4F8EF7" />
          <StatRow label="General Beds" total={stats.general.total} occupied={stats.general.occupied} color="#22C55E" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
        <StatusRow icon="✅" label="Occupied"  value={totalOccupied}  color="#4F8EF7" />
        <StatusRow icon="✅" label="Available" value={totalAvailable} color="#22C55E" />
      </div>

      <Button size="sm" fullWidth style={{ marginTop: 14 }}>Update Status</Button>
    </div>
  )
}

function StatRow({ label, total, occupied, color }) {
  const pct = Math.round((occupied / total) * 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{occupied}/{total}</span>
      </div>
      <div style={{ height: 5, background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 10, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

function StatusRow({ icon, label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
        <span style={{ fontSize: 14 }}>{icon}</span> {label}
      </div>
      <span style={{ fontWeight: 700, color }}>{value}</span>
    </div>
  )
}