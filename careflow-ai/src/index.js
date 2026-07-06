require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const emergencyRoutes = require('./routes/emergency');
const priorityRoutes = require('./routes/priority');
const drugRoutes = require('./routes/drugConflict');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/ai/emergency', emergencyRoutes);
app.use('/api/ai/priority', priorityRoutes);
app.use('/api/ai/drugs', drugRoutes);
app.use('/api/ai/health', healthRoutes);

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: '🤖 CareFlow AI Engine',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      emergency_routing: 'POST /api/ai/emergency/route',
      gmaps_link:        'POST /api/ai/emergency/maps-link',
      priority_score:    'POST /api/ai/priority/score',
      drug_conflict:     'POST /api/ai/drugs/check',
      health:            'GET  /api/ai/health'
    }
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 CareFlow AI Engine running on http://localhost:${PORT}`);
  console.log(`📋 API Docs: http://localhost:${PORT}/\n`);
});

module.exports = app;
