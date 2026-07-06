import { useState } from 'react';
import { scanQR } from '../api/medicare';

const QRScanner = () => {
  const [patientId, setPatientId]     = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError]             = useState('');

  const handleScan = async () => {
    try {
      setError('');
      const res = await scanQR(patientId);
      setPatientData(res.data);
    } catch {
      setError('Patient not found');
      setPatientData(null);
    }
  };

  return (
    <div>
      <h2>Scan Patient QR</h2>
      <input
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
        placeholder="Paste Patient ID from QR"
      />
      <button onClick={handleScan}>Fetch Patient</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {patientData && (
        <div>
          <h3>{patientData.user?.name}</h3>
          <p>Email: {patientData.user?.email}</p>
          <p>Phone: {patientData.user?.phone}</p>

          <h4>Medical History</h4>
          <p>Conditions: {patientData.history?.conditions?.join(', ') || 'None'}</p>
          <p>Allergies:  {patientData.history?.allergies?.join(', ')  || 'None'}</p>

          <h4>Prescriptions</h4>
          {patientData.prescriptions?.map(p => (
            <div key={p.id}>
              <p>Issued: {new Date(p.issuedAt).toLocaleDateString()}</p>
              <p>Notes: {p.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QRScanner;