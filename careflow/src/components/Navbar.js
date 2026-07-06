import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/emergency':    'Emergency',
  '/appointments': 'Appointments',
  '/records':      'Medical Records',
  '/reports':      'Report Validity',
  '/profile':      'Profile',
};

/* Shown only on mobile (md:hidden) */
export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = PAGE_TITLES[pathname] || 'CareFlow';
  const initials = user?.name ? user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : 'CF';

  return (
    <header
      className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{
        background: 'rgba(6,10,18,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Logo small */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'linear-gradient(135deg,#00bcd4,#006064)' }}
        >
          🏥
        </div>
        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, color: '#67e8f9' }}>
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px', cursor: 'pointer' }}
        >
          <Bell size={15} color="rgba(255,255,255,0.5)" />
        </button>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
          style={{ background: 'linear-gradient(135deg,#00bcd4,#006064)', color: '#fff', fontFamily: 'Outfit' }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
