const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

exports.register = async (req, res) => {
  console.log('📥 POST /api/auth/register');
  console.log('📋 Data received:', { ...req.body, password: '***hidden***' });

  try {
    const { name, email, password, role, phone } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role, phone });

    console.log(`✅ User registered — ID: ${user.id} | Role: ${user.role}`);
    res.status(201).json({ message: 'Registered', userId: user.id });
  } catch (err) {
    console.log('❌ Register error:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log('📥 POST /api/auth/login');
  console.log('📧 Email:', req.body.email);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('❌ Login failed — invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log(`✅ Login success — User: ${user.name} | Role: ${user.role}`);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.log('❌ Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
};