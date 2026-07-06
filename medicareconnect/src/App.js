import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.js';

// Layout
import DashboardLayout from './components/layout/DashboardLayout.js';
import ProtectedRoute from './components/ProtectedRoute.js';

// Pages
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Dashboard from './pages/Dashboard.js';
import Emergency from './pages/Emergency.js';
import Beds from './pages/Beds.js';
import Patients from './pages/Patients.js';
import Admissions from './pages/Admissions.js';
import Booking from './pages/Booking.js';
import History from './pages/History.js';
import Profile from './pages/Profile.js';
import QRPage from './pages/QRPage.js';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        {/* Protected routes wrapped in DashboardLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="beds" element={<Beds />} />
          <Route path="patients" element={<Patients />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="booking" element={<Booking />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
          <Route path="qr-scanner" element={<QRPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;