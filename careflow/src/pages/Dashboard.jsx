import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const name     = localStorage.getItem('name');

  return (
    <div>
      <h2>Welcome, {name}</h2>
      <button onClick={() => navigate('/appointments')}>My Appointments</button>
      <button onClick={() => navigate('/emergency')}>Raise Emergency</button>
      <button onClick={() => navigate('/history')}>Medical History</button>
      <button onClick={() => navigate('/prescriptions')}>Prescriptions</button>
      <button onClick={() => navigate('/qrcode')}>My QR Code</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;