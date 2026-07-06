/**
 * Emergency Routing Routes
 * Base: /api/ai/emergency
 */

const express = require('express');
const router  = express.Router();
const { routeEmergency }         = require('../services/emergencyRoutingService');
const { buildGoogleMapsLink, buildHospitalPinLink } = require('../services/mapsService');

/**
 * POST /api/ai/emergency/route
 *
 * Body: {
 *   patientLocation: { lat: 11.9139, lng: 79.8145 },
 *   condition: "cardiac_arrest",
 *   hospitals: [
 *     { id, name, lat, lng, icuAvailable, totalBeds, occupiedBeds, specialties[] }
 *   ]
 * }
 *
 * Response: {
 *   bestHospital: { ...details, mapsLink },
 *   allRanked: [...],
 *   mapsLink: "https://maps.google.com/...",
 *   explanation: "..."
 * }
 */
router.post('/route', async (req, res, next) => {
  try {
    const { patientLocation, condition, hospitals } = req.body;

    // ── Validation ─────────────────────────────────────────────────────────
    if (!patientLocation || !patientLocation.lat || !patientLocation.lng) {
      return res.status(400).json({
        success: false,
        error: 'patientLocation with lat and lng is required'
      });
    }
    if (!hospitals || !Array.isArray(hospitals) || hospitals.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'hospitals array is required'
      });
    }

    const result = await routeEmergency(
      patientLocation,
      condition || 'general',
      hospitals
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/emergency/maps-link
 *
 * Generates a Google Maps navigation link from patient to hospital.
 * Used by PATIENT APP to open navigation.
 *
 * Body: {
 *   patientLocation: { lat, lng },
 *   hospital: { lat, lng, name }
 * }
 */
router.post('/maps-link', (req, res) => {
  const { patientLocation, hospital } = req.body;

  if (!patientLocation || !hospital) {
    return res.status(400).json({ success: false, error: 'patientLocation and hospital required' });
  }

  const mapsLink = buildGoogleMapsLink(patientLocation, hospital);
  const pinLink  = buildHospitalPinLink(hospital);

  res.json({
    success:     true,
    mapsLink,
    pinLink,
    deepLink:    `comgooglemaps://?daddr=${hospital.lat},${hospital.lng}&directionsmode=driving`,
    instruction: 'Use mapsLink for web browsers. deepLink for Google Maps app on Android/iOS.'
  });
});

/**
 * GET /api/ai/emergency/test
 * Quick test with mock data — useful during development.
 */
router.get('/test', async (req, res, next) => {
  try {
    const mockHospitals = [
      {
        id: 'h1', name: 'JIPMER Puducherry',
        lat: 11.9344, lng: 79.8096,
        icuAvailable: 8, totalBeds: 200, occupiedBeds: 140,
        specialties: ['emergency', 'trauma', 'cardiology', 'oncology']
      },
      {
        id: 'h2', name: 'PIMS Hospital',
        lat: 11.9250, lng: 79.8300,
        icuAvailable: 2, totalBeds: 80, occupiedBeds: 70,
        specialties: ['general', 'emergency']
      },
      {
        id: 'h3', name: 'Mahatma Gandhi Medical',
        lat: 11.9100, lng: 79.8500,
        icuAvailable: 5, totalBeds: 150, occupiedBeds: 90,
        specialties: ['emergency', 'surgery', 'orthopedics']
      }
    ];

    const result = await routeEmergency(
      { lat: 11.9139, lng: 79.8145 },
      'cardiac_arrest',
      mockHospitals
    );

    res.json({ message: '✅ Test successful', result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
