import React, { useState } from 'react'

export default function Input({
  label, placeholder, value, onChange, type = 'text',
  icon, error, disabled = false, fullWidth = true, style = {},
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', ...style }}>
      {label && (
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
          }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: icon ? '10px 14px 10px 38px' : '10px 14px',
            border: `1.5px solid ${error ? 'var(--emergency)' : focused ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'inherit',
            background: disabled ? 'var(--surface-2)' : 'var(--surface)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.18s ease',
          }}
        />
      </div>
      {error && <div style={{ fontSize: '11px', color: 'var(--emergency)', marginTop: 4 }}>{error}</div>}
    </div>
  )
}