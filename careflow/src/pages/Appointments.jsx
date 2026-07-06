import { useState, useEffect } from 'react';
import { getAppointments, bookAppointment } from '../api/patient';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    doctorId:    '',
    hospitalId:  '',
    scheduledAt: '',
    notes:       '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const fetchAppointments = () =>
    getAppointments().then(res => setAppointments(res.data));

  useEffect(() => { fetchAppointments(); }, []);

  const handleBook = async () => {
    try {
      setError('');
      await bookAppointment(form);
      setSuccess('✅ Appointment booked! Doctor will see it on their dashboard.');
      setForm({ doctorId: '', hospitalId: '', scheduledAt: '', notes: '' });
      fetchAppointments(); // refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Book Appointment</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          value={form.doctorId}
          onChange={e => setForm({ ...form, doctorId: e.target.value })}
          placeholder="Doctor ID"
        />
        <input
          value={form.hospitalId}
          onChange={e => setForm({ ...form, hospitalId: e.target.value })}
          placeholder="Hospital ID"
        />
        <input
          value={form.scheduledAt}
          onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
          type="datetime-local"
        />
        <textarea
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          placeholder="Notes / symptoms"
          rows={3}
        />
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error   && <p style={{ color: 'red'   }}>{error}</p>}
        <button onClick={handleBook}>Book Appointment</button>
      </div>

      <h2 style={{ marginTop: '30px' }}>My Appointments</h2>
      {appointments.length === 0 && <p>No appointments yet</p>}
      {appointments.map(appt => (
        <div key={appt.id} style={{ border: '1px solid #ccc', margin: '8px 0', padding: '12px', borderRadius: '8px' }}>
          <p><b>Date:</b> {new Date(appt.scheduledAt).toLocaleString()}</p>
          <p><b>Status:</b> {appt.status}</p>
          <p><b>Notes:</b> {appt.notes}</p>
        </div>
      ))}
    </div>
  );
};

export default Appointments;