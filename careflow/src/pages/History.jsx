import { useState, useEffect } from 'react';
import { getHistory } from '../api/patient';

const History = () => {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    getHistory().then(res => setHistory(res.data));
  }, []);

  if (!history) return <p>Loading...</p>;

  return (
    <div>
      <h2>Medical History</h2>

      <h3>Appointments</h3>
      {history.appts?.map(a => (
        <div key={a.id}>
          <p>Date: {new Date(a.scheduledAt).toLocaleString()} — {a.status}</p>
        </div>
      ))}

      <h3>Admissions</h3>
      {history.admissions?.map(a => (
        <div key={a.id}>
          <p>Admitted: {new Date(a.admittedAt).toLocaleDateString()} — {a.status}</p>
          <p>Diagnosis: {a.diagnosis}</p>
        </div>
      ))}

      <h3>Prescriptions</h3>
      {history.prescriptions?.map(p => (
        <div key={p.id}>
          <p>Issued: {new Date(p.issuedAt).toLocaleDateString()}</p>
          <p>Notes: {p.notes}</p>
        </div>
      ))}
    </div>
  );
};

export default History;