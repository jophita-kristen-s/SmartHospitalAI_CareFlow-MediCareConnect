import { useState, useEffect } from 'react';
import { getQueue } from '../api/hospital';
import { logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const navigate   = useNavigate();
  const name       = localStorage.getItem('name');
  const hospitalId = localStorage.getItem('hospitalId') || '1';

  const fetchAppointments = () => {
    setLoading(true);
    getQueue(hospitalId)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();

    // auto refresh every 30 seconds
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'pending')   return 'orange';
    if (status === 'confirmed') return 'green';
    if (status === 'cancelled') return 'red';
    if (status === 'done')      return 'gray';
    return 'black';
  };

  return (
    <div style={{ padding: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Hospital Dashboard — Dr. {name}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/emergency-queue')}>Emergency Queue</button>
          <button onClick={() => navigate('/beds')}>Bed Manager</button>
          <button onClick={() => navigate('/qr-scanner')}>Scan QR</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Appointments Section */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Patient Appointments ({appointments.length})</h3>
          <button onClick={fetchAppointments}>Refresh</button>
        </div>

        {loading && <p>Loading appointments...</p>}

        {!loading && appointments.length === 0 && (
          <p>No appointments yet. Waiting for patients to book.</p>
        )}

        {appointments.map(appt => (
          <div
            key={appt.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              margin: '10px 0',
              borderLeft: `4px solid ${getStatusColor(appt.status)}`,
            }}
          >
            {/* Patient Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0 }}>
                  {appt.patient?.name || 'Unknown Patient'}
                </h4>
                <p style={{ margin: '4px 0', color: '#666' }}>
                  {appt.patient?.email} | {appt.patient?.phone}
                </p>
              </div>
              <span style={{ color: getStatusColor(appt.status), fontWeight: 'bold' }}>
                {appt.status.toUpperCase()}
              </span>
            </div>

            {/* Appointment Details */}
            <p><b>Scheduled:</b> {new Date(appt.scheduledAt).toLocaleString()}</p>
            <p><b>Notes:</b> {appt.notes || 'No notes'}</p>
            <p style={{ color: '#999', fontSize: '12px' }}>
              Booked at: {new Date(appt.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;