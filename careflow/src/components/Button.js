import React from 'react';
import { motion } from 'framer-motion';

export function PrimaryButton({ children, onClick, disabled, className = '', style = {} }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary ${className}`}
      style={{ opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
    >
      {children}
    </motion.button>
  );
}

export function OutlineButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`btn-outline ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({ children, onClick, className = '', danger = false }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="btn-ghost"
      style={{
        color: danger ? '#f87171' : undefined,
        borderColor: danger ? 'rgba(239,68,68,0.2)' : undefined,
        background: danger ? 'rgba(239,68,68,0.07)' : undefined,
      }}
    >
      {children}
    </motion.button>
  );
}

export function IconButton({ icon: Icon, onClick, color, bg, size = 15 }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className="flex items-center justify-center rounded-xl"
      style={{
        width: 34, height: 34,
        background: bg || 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
      }}
    >
      <Icon size={size} color={color || 'rgba(255,255,255,0.5)'} />
    </motion.button>
  );
}
