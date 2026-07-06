import { useState } from 'react';
import { raiseEmergency } from '../api/patient';

const Emergency = () => {
  const [form, setForm]     = useState({ description: '', location: '', severity: 'medium' });
  const [success, setSuccess] = useState('');
  const [error, setError]   = useState('');

  const handleSubmit = async () => {
    try {
      await raiseEmergency(form);
      setSuccess('Emergency raised! Help is on the way.');
      setForm({ description: '', location: '', severity: 'medium' });
    } catch {
      setError('Failed to raise emergency');
    }
  };

  return (
    <div>
      <h2>Raise Emergency</h2>
      <textarea
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Describe the emergency"
      />
      <input
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
        placeholder="Your location"
      />
      <select
        value={form.severity}
        onChange={e => setForm({ ...form, severity: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="critical">Critical</option>
      </select>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit}>Send Emergency Alert</button>
    </div>
  );
};

export default Emergency;