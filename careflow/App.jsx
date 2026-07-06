import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Emergency    from './pages/Emergency';
import History      from './pages/History';
import Prescriptions from './pages/Prescriptions';
import QRCode       from './pages/QRCode';

// protect routes — redirect to login if no token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
      <Route path="/emergency"    element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
      <Route path="/history"      element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
      <Route path="/qrcode"       element={<ProtectedRoute><QRCode /></ProtectedRoute>} />
      <Route path="*"             element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);

export default App;