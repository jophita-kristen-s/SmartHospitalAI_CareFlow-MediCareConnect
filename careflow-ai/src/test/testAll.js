/**
 * ─────────────────────────────────────────────────────
 *  testAll.js
 *  Run: node src/test/testAll.js
 *  Tests all 3 AI modules without needing a server.
 * ─────────────────────────────────────────────────────
 */

require('dotenv').config();
const { routeEmergency }         = require('../services/emergencyRoutingService');
const { computePriorityScore }   = require('../services/priorityService');
const { checkDrugConflicts }     = require('../services/drugConflictService');

async function run() {
  console.log('\n══════════════════════════════════════════════');
  console.log('   🤖 CareFlow AI Engine — Test Suite');
  console.log('══════════════════════════════════════════════\n');

  // ─────────────────────────────────────────────────
  //  TEST 1: Emergency Routing
  // ─────────────────────────────────────────────────
  console.log('1️⃣  EMERGENCY ROUTING TEST');
  console.log('─────────────────────────────────────────────');

  const hospitals = [
    {
      id: 'h1', name: 'JIPMER Puducherry',
      lat: 11.9344, lng: 79.8096,
      icuAvailable: 8, totalBeds: 200, occupiedBeds: 140,
      specialties: ['emergency', 'cardiology', 'oncology', 'trauma'],
      address: 'Dhanvantari Nagar, Puducherry'
    },
    {
      id: 'h2', name: 'PIMS Hospital',
      lat: 11.9250, lng: 79.8300,
      icuAvailable: 2, totalBeds: 80, occupiedBeds: 72,
      specialties: ['general', 'emergency'],
      address: 'Gorimedu, Puducherry'
    },
    {
      id: 'h3', name: 'MGM Healthcare',
      lat: 11.9100, lng: 79.8500,
      icuAvailable: 5, totalBeds: 150, occupiedBeds: 90,
      specialties: ['emergency', 'surgery', 'orthopedics'],
      address: 'Anna Salai, Puducherry'
    }
  ];

  try {
    const routeResult = await routeEmergency(
      { lat: 11.9139, lng: 79.8145 },
      'cardiac_arrest',
      hospitals
    );

    console.log(`✅ Best Hospital: ${routeResult.bestHospital.name}`);
    console.log(`   Distance:      ${routeResult.bestHospital.distanceKm} km`);
    console.log(`   ICU Available: ${routeResult.bestHospital.icuAvailable}`);
    console.log(`   AI Score:      ${routeResult.bestHospital.aiScore}`);
    console.log(`   Maps Link:     ${routeResult.mapsLink}`);
    console.log(`   Explanation:   ${routeResult.explanation}`);
    console.log('\n   All Ranked:');
    routeResult.allRanked.forEach(h =>
      console.log(`   ${h.rank}. ${h.name.padEnd(25)} ${h.distanceKm}km  Score: ${h.aiScore.toFixed(1)}`)
    );
  } catch (err) {
    console.error('❌ Routing test failed:', err.message);
  }

  // ─────────────────────────────────────────────────
  //  TEST 2: Priority Scoring
  // ─────────────────────────────────────────────────
  console.log('\n2️⃣  PRIORITY SCORING TEST');
  console.log('─────────────────────────────────────────────');

  const priorityTests = [
    {
      label: 'Heart Attack Patient',
      input: {
        condition: 'cardiac_arrest', conditionType: 'emergency',
        isEmergency: true, age: 65,
        vitalSigns: { heartRate: 140, oxygenSat: 86, bloodPressureSystolic: 80 }
      }
    },
    {
      label: 'Cancer Stage 3',
      input: { condition: 'cancer_stage3', conditionType: 'cancer', isEmergency: false, age: 50 }
    },
    {
      label: 'Infant with High Fever',
      input: {
        condition: 'high_fever', conditionType: 'general',
        isEmergency: false, age: 2,
        vitalSigns: { temperature: 40.5 }
      }
    },
    {
      label: 'Routine Checkup',
      input: { condition: 'general_checkup', conditionType: 'general', isEmergency: false, age: 35 }
    }
  ];

  priorityTests.forEach(test => {
    const result = computePriorityScore(test.input);
    console.log(`\n   ${test.label}`);
    console.log(`   → Score: ${result.score} | Tier: ${result.badge} ${result.label}`);
    console.log(`   → Wait:  ${result.estimatedWait}`);
  });

  // ─────────────────────────────────────────────────
  //  TEST 3: Drug Conflict Detection
  // ─────────────────────────────────────────────────
  console.log('\n3️⃣  DRUG CONFLICT DETECTION TEST');
  console.log('─────────────────────────────────────────────');

  const drugTests = [
    {
      label: 'Warfarin + Aspirin (CRITICAL)',
      new: ['Warfarin'], existing: ['Aspirin']
    },
    {
      label: 'Cancer: Methotrexate + Ibuprofen',
      new: ['Ibuprofen'], existing: ['Methotrexate']
    },
    {
      label: 'Safe combo: Amoxicillin + Paracetamol',
      new: ['Amoxicillin'], existing: ['Paracetamol']
    },
    {
      label: 'Multiple drugs: Lisinopril + Potassium + Warfarin',
      new: ['Warfarin', 'Potassium'], existing: ['Lisinopril', 'Aspirin']
    }
  ];

  drugTests.forEach(test => {
    const result = checkDrugConflicts(test.new, test.existing);
    console.log(`\n   ${test.label}`);
    console.log(`   → Safe: ${result.safe ? '✅ YES' : '❌ NO'}`);
    console.log(`   → ${result.recommendation}`);
    if (result.conflicts.length > 0) {
      result.conflicts.forEach(c =>
        console.log(`      ⛔ ${c.drug1} + ${c.drug2}: ${c.effect}`)
      );
    }
  });

  console.log('\n══════════════════════════════════════════════');
  console.log('   ✅ All tests completed');
  console.log('══════════════════════════════════════════════\n');
}

run().catch(console.error);
