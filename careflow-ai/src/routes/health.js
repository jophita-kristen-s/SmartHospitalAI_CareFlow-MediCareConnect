const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.json({
    status:    'healthy',
    service:   'CareFlow AI Engine',
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
    modules: {
      emergency_routing:    '✅ active',
      priority_scoring:     '✅ active',
      drug_conflict_check:  '✅ active',
      google_maps:          process.env.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? '✅ connected' : '⚠️  using Haversine fallback'
    }
  });
});

module.exports = router;
