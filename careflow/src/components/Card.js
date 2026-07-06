import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../styles/theme';

/** Premium dark glass card */
export function Card({ children, className = '', style = {}, delay = 0, hover = true, onClick }) {
  return (
    <motion.div
      custom={delay}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={hover ? 'hover' : undefined}
      whileTap={onClick ? 'tap' : undefined}
      className={`card-premium ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/** Lighter glass card */
export function GlassCard({ children, className = '', style = {}, delay = 0, onClick }) {
  return (
    <motion.div
      custom={delay}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap={onClick ? 'tap' : undefined}
      className={`glass-card ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/** Stat / metric mini card */
export function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      custom={delay}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="card-premium p-4 flex flex-col gap-2"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}
      >
        <Icon size={18} color={color} />
      </div>
      <div className="label-sm">{label}</div>
      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 17, color: '#f1f5f9' }}>{value}</div>
    </motion.div>
  );
}

export default Card;
