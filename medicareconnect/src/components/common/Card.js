import React from 'react'

export default function Card({ children, style = {}, className = '', onClick, padding = '20px' }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        ...style,
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)' } }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, icon, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: color || 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{title}</div>
          {subtitle && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}