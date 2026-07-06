import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { ToastProvider } from '../common/Toast'
import { APP_NAME } from '../../utils/constants'

const PAGE_TITLES = {
  '/dashboard': 'Medical Data Dashboard',
  '/emergency': 'Emergency Management',
  '/beds': 'Bed Management',
  '/patients': 'Patient Queue',
  '/admissions': 'Admissions',
  '/booking': 'Prescriptions & Bookings',
  '/history': 'History',
  '/profile': 'My Profile',
  '/qr-scanner': 'QR Scanner',
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || APP_NAME

  return (
    <ToastProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar title={title} />
          <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
