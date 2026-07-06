import { useState, useEffect } from 'react';
import { getBeds } from '../api/hospital';

const BedManager = () => {
  const [beds, setBeds]   = useState([]);
  const hospitalId = localStorage.getItem('hospitalId') || '1';

  useEffect(() => {
    getBeds(hospitalId).then(res => setBeds(res.data));
  }, []);

  const available = beds.filter(b => b.status === 'available').length;
  const occupied  = beds.filter(b => b.status === 'occupied').length;

  return (
    <div>
      <h2>Bed Manager</h2>
      <p>Available: {available} | Occupied: {occupied}</p>
      {beds.map(bed => (
        <div key={bed.id} style={{ border: '1px solid #ccc', margin: '4px', padding: '8px' }}>
          <p>Bed: {bed.bedNumber} | Ward: {bed.ward} | Status: {bed.status}</p>
        </div>
      ))}
    </div>
  );
};

export default BedManager;