import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';

import Sidebar from './components/Sidebar';
import Navbar   from './components/Navbar';

import Login       from './pages/Login';
import Signup      from './pages/Signup';
import Dashboard   from './pages/Dashboard';
import Emergency   from './pages/Emergency';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import ReportTracking from './pages/ReportTracking';
import Profile     from './pages/Profile';

/* ── Protected layout wrapper ── */
function AppLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="mesh-bg flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* mobile top bar */}
        <Navbar />
        <main className="flex-1 pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
      {/* mobile bottom nav lives inside Sidebar component */}
    </div>
  );
}

/* ── Guest guard ── */
function GuestLayout() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="mesh-bg min-h-screen">
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest routes */}
            <Route element={<GuestLayout />}>
              <Route path="/login"  element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Protected routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard"   element={<Dashboard />} />
              <Route path="/emergency"   element={<Emergency />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/records"     element={<MedicalRecords />} />
              <Route path="/reports"     element={<ReportTracking />} />
              <Route path="/profile"     element={<Profile />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </HealthProvider>
    </AuthProvider>
  );
}
