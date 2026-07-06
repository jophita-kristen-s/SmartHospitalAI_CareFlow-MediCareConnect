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
      if (user.role === 'doctor' || user.role === 'admin') navigate('/dashboard');
      else setError('Not a hospital account');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Hospital Staff Login</h2>
      <input value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;