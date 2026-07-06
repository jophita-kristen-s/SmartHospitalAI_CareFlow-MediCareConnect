import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext(null)

const ICONS = {
  success: 'OK',
  error: '!',
  warning: '!!',
  info: 'i',
}

const COLORS = {
  success: { bg: 'var(--success)', light: 'var(--success-light)' },
  error: { bg: 'var(--danger)', light: 'var(--danger-light)' },
  warning: { bg: 'var(--warning)', light: 'var(--warning-light)' },
  info: { bg: 'var(--primary)', light: 'var(--primary-light)' },
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)
  const c = COLORS[toast.type] || COLORS.info

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 3500)

    return () => clearTimeout(t)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 12,
        background: 'var(--surface)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        border: `1px solid ${c.light}`,
        minWidth: 260,
        maxWidth: 360,
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {ICONS[toast.type]}
      </div>
      <div style={{ flex: 1 }}>
        {toast.title && <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{toast.title}</div>}
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{toast.message}</div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: 16,
          lineHeight: 1,
          padding: 2,
        }}
      >
        x
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((opts) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type: 'info', ...opts }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = {
    success: (msg, title) => addToast({ type: 'success', message: msg, title }),
    error: (msg, title) => addToast({ type: 'error', message: msg, title }),
    warning: (msg, title) => addToast({ type: 'warning', message: msg, title }),
    info: (msg, title) => addToast({ type: 'info', message: msg, title }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
