import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { APP_NAME } from '../../utils/constants'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: 'DB' },
  { to: '/emergency', label: 'Emergency', icon: 'ER' },
  { to: '/beds', label: 'Beds', icon: 'BD' },
  { to: '/patients', label: 'Patient Queue', icon: 'PT' },
  { to: '/admissions', label: 'Admissions', icon: 'AD' },
  { to: '/booking', label: 'Prescriptions', icon: 'RX' },
  { to: '/qr-scanner', label: 'QR Scanner', icon: 'QR' },
]

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: '2px 0 16px rgba(79,142,247,0.06)',
      }}
    >
      <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            +
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--primary)' }}>
              {APP_NAME}
            </span>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 10,
              marginBottom: 2,
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: 13,
              background: isActive ? 'var(--primary-light)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'all 0.18s ease',
              border: isActive ? '1px solid rgba(79,142,247,0.15)' : '1px solid transparent',
            })}
          >
            <span style={{ fontSize: 11, fontWeight: 800, minWidth: 20 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {user?.name?.slice(0, 2).toUpperCase() || 'HC'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 12,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name || 'Hackathon User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role || 'Doctor'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '7px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
