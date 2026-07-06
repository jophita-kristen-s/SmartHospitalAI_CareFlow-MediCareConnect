import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import EmergencyQueue from './pages/EmergencyQueue';
import BedManager     from './pages/BedManager';
import QRScanner      from './pages/QRScanner';
import DrugCheck      from './pages/DrugCheck';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login"          element={<Login />} />
      <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/emergency-queue" element={<ProtectedRoute><EmergencyQueue /></ProtectedRoute>} />
      <Route path="/beds"           element={<ProtectedRoute><BedManager /></ProtectedRoute>} />
      <Route path="/qr-scanner"     element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />
      <Route path="/drug-check"     element={<ProtectedRoute><DrugCheck /></ProtectedRoute>} />
      <Route path="*"               element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);

export default App;