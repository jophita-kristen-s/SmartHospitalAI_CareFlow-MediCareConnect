import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const Register = () => {
  const [form, setForm]   = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      await register({ ...form, role: 'patient' });
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Patient Register</h2>
      <input name="name"     value={form.name}     onChange={handleChange} placeholder="Full Name" />
      <input name="email"    value={form.email}    onChange={handleChange} placeholder="Email" />
      <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" />
      <input name="phone"    value={form.phone}    onChange={handleChange} placeholder="Phone" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleRegister}>Register</button>
      <p onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
        Already have an account? Login
      </p>
    </div>
  );
};

export default Register;