/*import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      if (user.role === 'patient')  navigate('/patient/dashboard');
      if (user.role === 'doctor')   navigate('/doctor/dashboard');
      if (user.role === 'admin')    navigate('/hospital/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <input value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      if (user.role === 'patient') navigate('/dashboard');
      else setError('Not a patient account');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Patient Login</h2>
      <input value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <p onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
        No account? Register
      </p>
    </div>
  );
};

export default Login;