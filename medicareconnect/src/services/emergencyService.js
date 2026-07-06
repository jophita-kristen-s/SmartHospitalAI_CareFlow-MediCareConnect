import { delay, generateId } from '../utils/helpers';

let MOCK_EMERGENCY_CASES = [
  {
    id: 'e001',
    patientName: 'Mark Johnson',
    age: 45,
    gender: 'Male',
    location: 'North Gate, City Center',
    condition: 'Chest Pain',
    severity: 'critical',
    vitals: { bp: '150/95', pulse: 95, spo2: 75, temp: 99.2 },
    arrivalTime: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'pending',
    assignedTo: null,
    ambulanceId: 'AMB-01',
    notes: 'Patient reporting severe chest pain radiating to left arm.',
    triageScore: 95,
  },
  {
    id: 'e002',
    patientName: 'Emily Clark',
    age: 28,
    gender: 'Female',
    location: 'Industrial Road, Sector 4',
    condition: 'Severe Burn',
    severity: 'high',
    vitals: { bp: '110/70', pulse: 62, spo2: 87, temp: 100.1 },
    arrivalTime: new Date(Date.now() - 8 * 60000).toISOString(),
    status: 'pending',
    assignedTo: null,
    ambulanceId: 'AMB-02',
    notes: 'Second-degree burns on arms and upper chest.',
    triageScore: 87,
  },
  {
    id: 'e003',
    patientName: 'Tom Harris',
    age: 67,
    gender: 'Male',
    location: 'Central Bus Stand',
    condition: 'Stroke Symptoms',
    severity: 'critical',
    vitals: { bp: '180/110', pulse: 88, spo2: 90, temp: 98.8 },
    arrivalTime: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'accepted',
    assignedTo: 'Dr. Smith',
    ambulanceId: 'AMB-03',
    notes: 'Facial drooping, slurred speech, arm weakness.',
    triageScore: 99,
  },
];

let MOCK_ALERTS = [
  { id: 'a001', type: 'code_blue', message: 'Code Blue triggered in ICU Room 3', time: new Date(Date.now() - 2 * 60000).toISOString(), resolved: false },
  { id: 'a002', type: 'ambulance', message: 'Ambulance AMB-04 en route, ETA 3 mins', time: new Date(Date.now() - 1 * 60000).toISOString(), resolved: false },
];

const LIVE_TEMPLATES = [
  { patientName: 'Angela Roy', age: 34, gender: 'Female', location: 'Metro Station', condition: 'Breathing Difficulty', severity: 'high', vitals: { bp: '124/82', pulse: 102, spo2: 86, temp: 99.0 } },
  { patientName: 'Victor Stone', age: 51, gender: 'Male', location: 'Airport Road', condition: 'Road Traffic Trauma', severity: 'critical', vitals: { bp: '102/68', pulse: 112, spo2: 89, temp: 98.4 } },
  { patientName: 'Nina Patel', age: 63, gender: 'Female', location: 'Green Park', condition: 'Hypertensive Crisis', severity: 'high', vitals: { bp: '190/120', pulse: 91, spo2: 95, temp: 98.7 } },
];

export async function fetchEmergencyCases(status = 'all') {
  await delay(200);
  let cases = [...MOCK_EMERGENCY_CASES];
  if (status !== 'all') cases = cases.filter((item) => item.status === status);
  return cases.sort((a, b) => b.triageScore - a.triageScore);
}

export async function fetchEmergencyCaseById(id) {
  await delay(150);
  const emergencyCase = MOCK_EMERGENCY_CASES.find((item) => item.id === id);
  if (!emergencyCase) throw new Error(`Emergency case ${id} not found`);
  return { ...emergencyCase };
}

export async function acceptEmergencyCase(id, doctorName) {
  await delay(180);
  const index = MOCK_EMERGENCY_CASES.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Case not found');
  MOCK_EMERGENCY_CASES[index] = {
    ...MOCK_EMERGENCY_CASES[index],
    status: 'accepted',
    assignedTo: doctorName,
    acceptedAt: new Date().toISOString(),
  };
  return { ...MOCK_EMERGENCY_CASES[index] };
}

export async function rejectEmergencyCase(id, reason = '') {
  await delay(180);
  const index = MOCK_EMERGENCY_CASES.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Case not found');
  MOCK_EMERGENCY_CASES[index] = {
    ...MOCK_EMERGENCY_CASES[index],
    status: 'rejected',
    rejectionReason: reason,
    rejectedAt: new Date().toISOString(),
  };
  return { ...MOCK_EMERGENCY_CASES[index] };
}

export async function createEmergencyCase(data) {
  await delay(160);
  const template = data || LIVE_TEMPLATES[Math.floor(Math.random() * LIVE_TEMPLATES.length)];
  const newCase = {
    id: generateId('e'),
    arrivalTime: new Date().toISOString(),
    status: 'pending',
    assignedTo: null,
    ambulanceId: `AMB-${Math.floor(Math.random() * 90) + 10}`,
    triageScore: template.severity === 'critical' ? 97 : 84,
    ...template,
  };
  MOCK_EMERGENCY_CASES = [newCase, ...MOCK_EMERGENCY_CASES];
  MOCK_ALERTS = [
    {
      id: generateId('alert'),
      type: 'ambulance',
      message: `Incoming ${newCase.condition.toLowerCase()} case from ${newCase.location}`,
      time: new Date().toISOString(),
      resolved: false,
    },
    ...MOCK_ALERTS,
  ];
  return newCase;
}

export async function updateEmergencyStatus(id, status, notes = '') {
  await delay(150);
  const index = MOCK_EMERGENCY_CASES.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Case not found');
  MOCK_EMERGENCY_CASES[index] = { ...MOCK_EMERGENCY_CASES[index], status, notes };
  return { ...MOCK_EMERGENCY_CASES[index] };
}

export async function fetchAlerts() {
  await delay(150);
  return [...MOCK_ALERTS].filter((alert) => !alert.resolved);
}

export async function resolveAlert(id) {
  await delay(120);
  const index = MOCK_ALERTS.findIndex((alert) => alert.id === id);
  if (index !== -1) MOCK_ALERTS[index].resolved = true;
  return { success: true };
}

export async function fetchEmergencyStats() {
  await delay(120);
  return {
    waiting: MOCK_EMERGENCY_CASES.filter((item) => item.status === 'pending').length,
    accepted: MOCK_EMERGENCY_CASES.filter((item) => item.status === 'accepted').length,
    critical: MOCK_EMERGENCY_CASES.filter((item) => item.severity === 'critical').length,
    alerts: MOCK_ALERTS.filter((alert) => !alert.resolved).length,
  };
}
