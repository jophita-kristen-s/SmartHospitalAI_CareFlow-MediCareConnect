// CareFlow Design System — Tokens & Theme
export const colors = {
  primary: '#00bcd4',
  primaryDark: '#006064',
  accent: '#64ffda',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  bg: '#060a12',
  bgCard: '#0f1623',
  bgGlass: 'rgba(15,22,35,0.75)',
  border: 'rgba(255,255,255,0.07)',
  borderActive: 'rgba(0,188,212,0.4)',
  text: '#f1f5f9',
  textMuted: 'rgba(255,255,255,0.4)',
  textSubtle: 'rgba(255,255,255,0.25)',
};

export const fonts = {
  heading: "'Outfit', sans-serif",
  body: "'DM Sans', sans-serif",
};

export const shadows = {
  glow: '0 0 24px rgba(0,188,212,0.3)',
  glowLg: '0 0 48px rgba(0,188,212,0.4)',
  glowRed: '0 0 32px rgba(239,68,68,0.55)',
  card: '0 4px 28px rgba(0,0,0,0.45)',
  cardHover: '0 8px 40px rgba(0,0,0,0.6)',
};

// Framer Motion shared variants
export const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.38, ease: [0.4, 0, 0.2, 1] },
  }),
  hover: { scale: 1.025, y: -2, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.92, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
  exit: { opacity: 0, scale: 0.94, y: 30, transition: { duration: 0.18 } },
};
