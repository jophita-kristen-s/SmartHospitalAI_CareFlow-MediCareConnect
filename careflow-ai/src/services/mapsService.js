/**
 * ─────────────────────────────────────────────────────
 *  mapsService.js
 *  Handles all Google Maps interactions:
 *   - Distance Matrix (travel time between points)
 *   - Directions link generation for navigation
 *   - Nearest hospital selection
 * ─────────────────────────────────────────────────────
 */

const axios = require('axios');
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Get travel distances from ONE origin to MULTIPLE hospital destinations.
 * Uses Google Maps Distance Matrix API.
 *
 * @param {Object} origin      - { lat, lng }
 * @param {Array}  hospitals   - [{ id, name, lat, lng, ... }]
 * @returns {Array}            - hospitals with added `distanceKm` and `durationMin`
 */
async function getDistancesToHospitals(origin, hospitals) {
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    // ── FALLBACK: Use Haversine formula when no API key is set ──
    console.warn('⚠️  No Google Maps API key — using Haversine fallback');
    return hospitals.map(h => ({
      ...h,
      distanceKm: haversine(origin, { lat: h.lat, lng: h.lng }),
      durationMin: null,   // unknown without real routing
      source: 'haversine'
    }));
  }

  const destinations = hospitals
    .map(h => `${h.lat},${h.lng}`)
    .join('|');

  const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

  try {
    const { data } = await axios.get(url, {
      params: {
        origins: `${origin.lat},${origin.lng}`,
        destinations,
        mode: 'driving',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (data.status !== 'OK') {
      throw new Error(`Maps API error: ${data.status}`);
    }

    const elements = data.rows[0].elements;

    return hospitals.map((hospital, i) => {
      const el = elements[i];
      if (el.status === 'OK') {
        return {
          ...hospital,
          distanceKm: parseFloat((el.distance.value / 1000).toFixed(2)),
          durationMin: Math.ceil(el.duration.value / 60),
          distanceText: el.distance.text,
          durationText: el.duration.text,
          source: 'google_maps'
        };
      }
      // Element failed — fallback to Haversine for this one
      return {
        ...hospital,
        distanceKm: haversine(origin, { lat: hospital.lat, lng: hospital.lng }),
        durationMin: null,
        source: 'haversine_fallback'
      };
    });

  } catch (err) {
    console.error('❌ Distance Matrix API failed:', err.message);
    // Full Haversine fallback
    return hospitals.map(h => ({
      ...h,
      distanceKm: haversine(origin, { lat: h.lat, lng: h.lng }),
      durationMin: null,
      source: 'haversine_fallback'
    }));
  }
}

/**
 * Build a Google Maps navigation link.
 * When opened, this launches Google Maps / Google Maps App
 * and navigates the user to the destination.
 *
 * @param {Object} origin      - { lat, lng }
 * @param {Object} destination - { lat, lng, name }
 * @returns {String}           - Google Maps URL
 */
function buildGoogleMapsLink(origin, destination) {
  const base = 'https://www.google.com/maps/dir/';
  const from = `${origin.lat},${origin.lng}`;
  const to   = `${destination.lat},${destination.lng}`;
  return `${base}?api=1&origin=${from}&destination=${to}&travelmode=driving`;
}

/**
 * Simpler pin-drop link (when only destination is known)
 */
function buildHospitalPinLink(destination) {
  return `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`;
}

/**
 * Haversine formula — straight-line distance in km.
 * Used as fallback when no API key is available.
 */
function haversine(a, b) {
  const R = 6371; // Earth radius km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))).toFixed(2));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

module.exports = {
  getDistancesToHospitals,
  buildGoogleMapsLink,
  buildHospitalPinLink,
  haversine
};
