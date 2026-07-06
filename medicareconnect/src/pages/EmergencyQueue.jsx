import { useState, useEffect } from 'react';
import { getQueue, respondEmergency } from '../api/hospital';
import socket from '../api/socket';

const EmergencyQueue = () => {
  const [emergencies, setEmergencies] = useState([]);
  const hospitalId = localStorage.getItem('hospitalId') || '1';

  useEffect(() => {
    // load existing queue
    getQueue(hospitalId).then(res => setEmergencies(res.data));

    // join socket room
    socket.emit('join:hospital', hospitalId);

    // new emergency comes in
    socket.on('emergency:new', (data) => {
      setEmergencies(prev => [data, ...prev]);
    });

    // emergency status updated
    socket.on('emergency:update', (data) => {
      setEmergencies(prev => prev.map(e => e.id === data.id ? data : e));
    });

    return () => {
      socket.off('emergency:new');
      socket.off('emergency:update');
    };
  }, [hospitalId]);

  const handleRespond = async (id) => {
    await respondEmergency(id);
  };

  return (
    <div>
      <h2>Emergency Queue</h2>
      {emergencies.length === 0 && <p>No active emergencies</p>}
      {emergencies.map(e => (
        <div key={e.id} style={{ border: '1px solid red', margin: '8px', padding: '8px' }}>
          <p>Severity: {e.severity}</p>
          <p>Status: {e.status}</p>
          <p>Description: {e.description}</p>
          <p>Location: {e.location}</p>
          {e.status === 'open' && (
            <button onClick={() => handleRespond(e.id)}>Respond</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmergencyQueue;