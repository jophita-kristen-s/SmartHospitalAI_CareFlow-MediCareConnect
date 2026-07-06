import React from 'react'

const variants = {
  primary:   { background: 'var(--primary)',   color: '#fff', border: 'none' },
  danger:    { background: 'var(--emergency)', color: '#fff', border: 'none' },
  success:   { background: 'var(--success)',   color: '#fff', border: 'none' },
  ghost:     { background: 'transparent', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' },
  secondary: { background: 'var(--primary-light)', color: 'var(--primary)', border: 'none' },
}

const sizes = {
  sm: { padding: '6px 14px', fontSize: '12px', borderRadius: '8px' },
  md: { padding: '9px 20px', fontSize: '13px', borderRadius: '10px' },
  lg: { padding: '12px 28px', fontSize: '15px', borderRadius: '12px' },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  style = {},
  type = 'button',
}) {
  const v = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontFamily: 'inherit',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.18s ease',
        boxShadow: variant === 'primary' ? '0 2px 8px rgba(79,142,247,0.28)' : 'none',
        ...v,
        ...s,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  )
}