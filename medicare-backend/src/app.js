const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Global request logger ──────────────────────────
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.url}`);
  console.log(`   From: ${req.headers.origin || 'unknown'}`);
  console.log(`   Time: ${new Date().toLocaleTimeString()}`);
  next();
});
// ───────────────────────────────────────────────────

app.use((req, res, next) => { req.io = app.get('io'); next(); });

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/patient',  require('./routes/patient'));
app.use('/api/hospital', require('./routes/hospital'));
app.use('/api/medicare', require('./routes/medicare'));

app.get('/', (_, res) => res.json({ status: 'MediCare API running' }));

module.exports = app;
