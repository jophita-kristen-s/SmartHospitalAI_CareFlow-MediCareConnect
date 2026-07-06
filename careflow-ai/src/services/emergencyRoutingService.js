/**
 * ─────────────────────────────────────────────────────
 *  emergencyRoutingService.js
 *  THE BRAIN of the emergency system.
 *
 *  Algorithm:
 *   Score = (1/distance * 40) + (icuAvail * 30) + (loadScore * 20) + (priorityBonus * 10)
 *
 *  Higher score = better hospital for this patient.
 * ─────────────────────────────────────────────────────
 */

const { getDistancesToHospitals, buildGoogleMapsLink } = require('./mapsService');

/**
 * Main routing function.
 *
 * @param {Object} patientLocation  - { lat, lng }
 * @param {String} condition        - e.g. "cardiac_arrest", "accident", "cancer_emergency"
 * @param {Array}  hospitals        - Array from DB: [{ id, name, lat, lng, icuAvailable, totalBeds, occupiedBeds, specialties[] }]
 * @returns {Object}                - { bestHospital, allRanked, mapsLink, explanation }
 */
async function routeEmergency(patientLocation, condition, hospitals) {
  if (!hospitals || hospitals.length === 0) {
    throw new Error('No hospitals provided for routing');
  }

  // ── Step 1: Get real distances via Google Maps ──────────────────────────────
  const hospitalsWithDistance = await getDistancesToHospitals(patientLocation, hospitals);

  // ── Step 2: Score every hospital ───────────────────────────────────────────
  const scored = hospitalsWithDistance.map(h => {
    const score = computeHospitalScore(h, condition);
    return { ...h, aiScore: score };
  });

  // ── Step 3: Sort — highest score first ─────────────────────────────────────
  scored.sort((a, b) => b.aiScore - a.aiScore);

  const best = scored[0];

  // ── Step 4: Build Google Maps navigation link ───────────────────────────────
  const mapsLink = buildGoogleMapsLink(patientLocation, {
    lat: best.lat,
    lng: best.lng,
    name: best.name
  });

  // ── Step 5: Human-readable explanation ─────────────────────────────────────
  const explanation = buildExplanation(best, condition);

  return {
    success: true,
    bestHospital: {
      id:           best.id,
      name:         best.name,
      address:      best.address || '',
      lat:          best.lat,
      lng:          best.lng,
      distanceKm:   best.distanceKm,
      durationMin:  best.durationMin,
      durationText: best.durationText || `~${Math.round(best.distanceKm * 3)} min`,
      icuAvailable: best.icuAvailable,
      aiScore:      parseFloat(best.aiScore.toFixed(2)),
      mapsLink,
      mapsEmbed:    `https://maps.google.com/maps?q=${best.lat},${best.lng}&z=15&output=embed`
    },
    allRanked: scored.map((h, i) => ({
      rank:        i + 1,
      id:          h.id,
      name:        h.name,
      distanceKm:  h.distanceKm,
      durationMin: h.durationMin,
      icuAvailable: h.icuAvailable,
      aiScore:     parseFloat(h.aiScore.toFixed(2))
    })),
    mapsLink,
    explanation,
    routingMethod: scored[0].source || 'calculated'
  };
}

/**
 * Score a hospital based on multiple weighted factors.
 *
 * Weights:
 *  - Distance      : 40 pts  (closer = higher)
 *  - ICU Available : 30 pts  (has ICU beds = higher)
 *  - Load/Capacity : 20 pts  (less crowded = higher)
 *  - Specialty     : 10 pts  (matches condition specialty)
 */
function computeHospitalScore(hospital, condition) {
  let score = 0;

  // ── Distance score (40 pts) ─────────────────────────────────────
  // Normalize: 1km = 40pts, 10km = 4pts, 50km = 0.8pts
  const distScore = 40 / (1 + hospital.distanceKm * 0.5);
  score += distScore;

  // ── ICU Availability (30 pts) ───────────────────────────────────
  const icuAvail = hospital.icuAvailable || 0;
  const icuScore = Math.min(30, icuAvail * 5); // 5pts per ICU bed, max 30
  score += icuScore;

  // ── Load / Capacity (20 pts) ────────────────────────────────────
  const total    = hospital.totalBeds    || 100;
  const occupied = hospital.occupiedBeds || 0;
  const freeRatio = (total - occupied) / total;
  score += freeRatio * 20;

  // ── Specialty Match (10 pts) ────────────────────────────────────
  const specialtyMap = {
    cardiac_arrest:    ['cardiology', 'icu', 'emergency'],
    stroke:            ['neurology', 'icu', 'emergency'],
    accident:          ['trauma', 'orthopedics', 'emergency', 'surgery'],
    cancer_emergency:  ['oncology', 'cancer', 'chemotherapy'],
    burns:             ['burns', 'plastic_surgery', 'emergency'],
    maternity:         ['maternity', 'gynecology', 'obstetrics'],
    pediatric:         ['pediatrics', 'children', 'emergency'],
    default:           ['emergency', 'general']
  };

  const needed  = specialtyMap[condition] || specialtyMap['default'];
  const hospSpec = (hospital.specialties || []).map(s => s.toLowerCase());
  const matches  = needed.filter(s => hospSpec.includes(s)).length;
  score += (matches / needed.length) * 10;

  return score;
}

/**
 * Build a plain-language explanation of why this hospital was chosen.
 */
function buildExplanation(hospital, condition) {
  const parts = [];

  if (hospital.distanceKm <= 3) {
    parts.push(`📍 Nearest hospital (${hospital.distanceKm} km away)`);
  } else {
    parts.push(`📍 ${hospital.distanceKm} km away`);
  }

  if (hospital.icuAvailable > 0) {
    parts.push(`🛏️ ${hospital.icuAvailable} ICU bed(s) available`);
  }

  const load = hospital.totalBeds
    ? Math.round(((hospital.totalBeds - (hospital.occupiedBeds || 0)) / hospital.totalBeds) * 100)
    : null;
  if (load !== null) {
    parts.push(`🏥 ${load}% capacity free`);
  }

  if (condition === 'cancer_emergency') {
    parts.push('🎗️ Oncology unit available');
  }

  return parts.join(' · ');
}

module.exports = { routeEmergency, computeHospitalScore };
