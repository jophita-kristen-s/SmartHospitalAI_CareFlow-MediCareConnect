import { useState } from 'react';
import { checkDrugs } from '../api/medicare';

const DrugCheck = () => {
  const [patientId, setPatientId] = useState('');
  const [drugInput, setDrugInput] = useState('');
  const [result, setResult]       = useState(null);

  const handleCheck = async () => {
    const drugs = drugInput.split(',').map(d => d.trim());
    const res   = await checkDrugs(drugs, patientId);
    setResult(res.data);
  };

  return (
    <div>
      <h2>Drug Conflict Checker</h2>
      <input
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
        placeholder="Patient ID"
      />
      <input
        value={drugInput}
        onChange={e => setDrugInput(e.target.value)}
        placeholder="Enter drugs separated by commas e.g. warfarin, aspirin"
      />
      <button onClick={handleCheck}>Check</button>

      {result && (
        <div>
          {result.safe
            ? <p style={{ color: 'green' }}>✅ No conflicts detected</p>
            : <p style={{ color: 'red' }}>⚠️ Conflict detected: {result.warnings.flat().join(', ')}</p>
          }
        </div>
      )}
    </div>
  );
};

export default DrugCheck;