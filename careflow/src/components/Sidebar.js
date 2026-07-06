import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, AlertTriangle, CalendarDays,
  FolderOpen, FileText, User, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/emergency',    label: 'Emergency',    icon: AlertTriangle   },
  { path: '/appointments', label: 'Appointments', icon: CalendarDays    },
  { path: '/records',      label: 'Records',      icon: FolderOpen      },
  { path: '/reports',      label: 'Validity',     icon: FileText        },
  { path: '/profile',      label: 'Profile',      icon: User            },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'CF';

  return (
    <>
      {/* ══════════ DESKTOP SIDEBAR ══════════ */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-50"
        style={{
          background: 'rgba(6,10,18,0.96)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg,#00bcd4,#006064)', boxShadow: '0 0 18px rgba(0,188,212,0.35)' }}
            >
              🏥
            </div>
            <div>
              <div className="gradient-text" style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16 }}>CareFlow</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', fontFamily: 'DM Sans' }}>MediCareConnect</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <NavLink to={path} key={path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: active ? 'rgba(0,188,212,0.11)' : 'transparent',
                    border:     active ? '1px solid rgba(0,188,212,0.22)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                      style={{ background: '#00bcd4' }}
                    />
                  )}
                  <Icon
                    size={18}
                    color={active ? '#00bcd4' : 'rgba(255,255,255,0.38)'}
                    style={path === '/emergency' && !active ? { color: 'rgba(239,68,68,0.6)' } : {}}
                  />
                  <span style={{
                    fontFamily: 'DM Sans',
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#67e8f9' : path === '/emergency' ? 'rgba(239,68,68,0.75)' : 'rgba(255,255,255,0.48)',
                  }}>
                    {label}
                  </span>
                  {path === '/emergency' && (
                    <span
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ background: '#ef4444', boxShadow: '0 0 6px #ef4444' }}
                    />
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#00bcd4,#006064)', color: '#fff', fontFamily: 'Outfit' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{user?.id || 'CF-2024'}</div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', cursor: 'pointer' }}
          >
            <LogOut size={14} color="#f87171" />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#f87171', fontFamily: 'DM Sans' }}>Log out</span>
          </motion.button>
        </div>
      </aside>

      {/* ══════════ MOBILE BOTTOM NAV ══════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      >
        <div
          className="flex items-center justify-around py-2 px-1 rounded-2xl"
          style={{
            background: 'rgba(6,10,18,0.94)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            const isEmergency = path === '/emergency';
            return (
              <NavLink to={path} key={path}>
                <motion.div
                  whileTap={{ scale: 0.82 }}
                  className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl relative"
                  style={{ background: active ? 'rgba(0,188,212,0.11)' : 'transparent' }}
                >
                  <Icon
                    size={20}
                    color={active ? '#00bcd4' : isEmergency ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.32)'}
                  />
                  <span style={{
                    fontSize: 9,
                    fontFamily: 'DM Sans',
                    fontWeight: active ? 700 : 400,
                    color: active ? '#67e8f9' : isEmergency ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.32)',
                  }}>
                    {label}
                  </span>
                  {isEmergency && (
                    <span
                      className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                      style={{ background: '#ef4444' }}
                    />
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
