import { delay, generateId } from '../utils/helpers';

let MOCK_PATIENTS = [
  {
    id: 'p001',
    name: 'Richard Davis',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 555-1001',
    ward: 'General',
    status: 'admitted',
    priority: 'medium',
    diagnosis: 'Respiratory Infection',
    admittedAt: '2026-03-24T08:00:00Z',
    doctor: 'Dr. Smith',
    room: 'G-101',
    queueType: 'OPD',
    slotTime: '09:30',
    vitals: { bp: '120/80', pulse: 72, temp: 98.6, spo2: 98 },
  },
  {
    id: 'p002',
    name: 'Sarah Miller',
    age: 62,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+1 555-1002',
    ward: 'ICU',
    status: 'admitted',
    priority: 'critical',
    diagnosis: 'Cardiac Monitoring',
    admittedAt: '2026-03-23T14:30:00Z',
    doctor: 'Dr. Smith',
    room: 'ICU-3',
    queueType: 'Cancer Priority',
    slotTime: '10:00',
    vitals: { bp: '140/90', pulse: 88, temp: 99.1, spo2: 94 },
  },
  {
    id: 'p003',
    name: 'Paul Brown',
    age: 38,
    gender: 'Male',
    bloodGroup: 'B-',
    phone: '+1 555-1003',
    ward: 'OPD',
    status: 'outpatient',
    priority: 'normal',
    diagnosis: 'Fracture Follow-up',
    admittedAt: '2026-03-26T09:00:00Z',
    doctor: 'Dr. Adams',
    room: null,
    queueType: 'OPD',
    slotTime: '11:15',
    vitals: { bp: '118/76', pulse: 68, temp: 98.2, spo2: 99 },
  },
  {
    id: 'p004',
    name: 'Patricia Lee',
    age: 55,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+1 555-1004',
    ward: 'General',
    status: 'admitted',
    priority: 'high',
    diagnosis: 'Oncology Review',
    admittedAt: '2026-03-22T09:15:00Z',
    doctor: 'Dr. Chen',
    room: 'G-205',
    queueType: 'Cancer Priority',
    slotTime: '12:00',
    vitals: { bp: '130/85', pulse: 76, temp: 98.9, spo2: 97 },
  },
  {
    id: 'p005',
    name: 'John Doe',
    age: 55,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 555-1005',
    ward: 'ICU',
    status: 'admitted',
    priority: 'critical',
    diagnosis: 'Cardiac Arrest Recovery',
    admittedAt: '2026-03-21T02:00:00Z',
    doctor: 'Dr. Smith',
    room: 'ICU-1',
    queueType: 'Cancer Priority',
    slotTime: '13:30',
    vitals: { bp: '150/95', pulse: 92, temp: 99.8, spo2: 92 },
  },
  {
    id: 'p006',
    name: 'Laura White',
    age: 50,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+1 555-1006',
    ward: 'General',
    status: 'admitted',
    priority: 'medium',
    diagnosis: 'Post-Surgery Recovery',
    admittedAt: '2026-03-25T16:00:00Z',
    doctor: 'Dr. Adams',
    room: 'G-204',
    queueType: 'OPD',
    slotTime: '15:00',
    vitals: { bp: '115/75', pulse: 70, temp: 98.4, spo2: 98 },
  },
];

const PATIENT_HISTORY = {
  p001: [
    { id: 'h-p001-1', date: '2026-03-26', type: 'Consultation', notes: 'Respiratory symptoms improved after antibiotics.', doctor: 'Dr. Smith' },
    { id: 'h-p001-2', date: '2026-03-25', type: 'Lab Test', notes: 'CBC and chest screening ordered.', doctor: 'Dr. Smith' },
  ],
  p002: [
    { id: 'h-p002-1', date: '2026-03-26', type: 'ICU Review', notes: 'Cardiac rhythm stable, continue telemetry.', doctor: 'Dr. Smith' },
    { id: 'h-p002-2', date: '2026-03-24', type: 'Emergency Visit', notes: 'Admitted after chest pain escalation.', doctor: 'Dr. Smith' },
  ],
  p003: [
    { id: 'h-p003-1', date: '2026-03-26', type: 'OPD Visit', notes: 'Cast reassessment scheduled.', doctor: 'Dr. Adams' },
  ],
  p004: [
    { id: 'h-p004-1', date: '2026-03-26', type: 'Oncology Review', notes: 'Tumor markers improving.', doctor: 'Dr. Chen' },
    { id: 'h-p004-2', date: '2026-03-23', type: 'Prescription', notes: 'Targeted therapy dose adjusted.', doctor: 'Dr. Chen' },
  ],
  p005: [
    { id: 'h-p005-1', date: '2026-03-26', type: 'ICU Review', notes: 'Recovery progressing, ventilator removed.', doctor: 'Dr. Smith' },
    { id: 'h-p005-2', date: '2026-03-22', type: 'Emergency Admission', notes: 'Critical cardiac arrest stabilization.', doctor: 'Dr. Smith' },
  ],
  p006: [
    { id: 'h-p006-1', date: '2026-03-26', type: 'Ward Round', notes: 'Pain reduced, mobility improving.', doctor: 'Dr. Adams' },
  ],
};

let PATIENT_PRESCRIPTIONS = {
  p001: [
    { id: 'rx-p001-1', medicine: 'Amoxicillin 500mg', dose: '1 tablet', route: 'Oral', frequency: 'Twice daily', prescribedAt: '2026-03-25T09:00:00Z', prescribedBy: 'Dr. Smith', conflict: false },
  ],
  p002: [
    { id: 'rx-p002-1', medicine: 'Aspirin 75mg', dose: '1 tablet', route: 'Oral', frequency: 'Once daily', prescribedAt: '2026-03-25T10:30:00Z', prescribedBy: 'Dr. Smith', conflict: false },
    { id: 'rx-p002-2', medicine: 'Warfarin 5mg', dose: '1 tablet', route: 'Oral', frequency: 'Once daily', prescribedAt: '2026-03-25T11:00:00Z', prescribedBy: 'Dr. Smith', conflict: true },
  ],
  p003: [
    { id: 'rx-p003-1', medicine: 'Ibuprofen 400mg', dose: '1 tablet', route: 'Oral', frequency: 'Every 8 hours', prescribedAt: '2026-03-26T09:30:00Z', prescribedBy: 'Dr. Adams', conflict: false },
  ],
  p004: [
    { id: 'rx-p004-1', medicine: 'Tamoxifen 20mg', dose: '1 tablet', route: 'Oral', frequency: 'Once daily', prescribedAt: '2026-03-24T12:00:00Z', prescribedBy: 'Dr. Chen', conflict: false },
  ],
  p005: [
    { id: 'rx-p005-1', medicine: 'Clopidogrel 75mg', dose: '1 tablet', route: 'Oral', frequency: 'Once daily', prescribedAt: '2026-03-24T06:45:00Z', prescribedBy: 'Dr. Smith', conflict: false },
  ],
  p006: [
    { id: 'rx-p006-1', medicine: 'Paracetamol 650mg', dose: '1 tablet', route: 'Oral', frequency: 'Every 8 hours', prescribedAt: '2026-03-25T18:00:00Z', prescribedBy: 'Dr. Adams', conflict: false },
  ],
};

const CONFLICT_RULES = [
  { medicines: ['aspirin 75mg', 'warfarin 5mg'], message: 'Bleeding risk increases when Aspirin and Warfarin are combined.' },
  { medicines: ['ibuprofen 400mg', 'warfarin 5mg'], message: 'Ibuprofen with Warfarin can increase bleeding risk.' },
  { medicines: ['clopidogrel 75mg', 'omeprazole 20mg'], message: 'Omeprazole can reduce Clopidogrel effectiveness.' },
];

export async function fetchPatients({ status = 'all', ward = 'all', page = 1, limit = 20 } = {}) {
  await delay(250);
  let filtered = [...MOCK_PATIENTS];
  if (status !== 'all') filtered = filtered.filter((patient) => patient.status === status);
  if (ward !== 'all') filtered = filtered.filter((patient) => patient.ward === ward);
  const total = filtered.length;
  const start = (page - 1) * limit;
  return { patients: filtered.slice(start, start + limit), total };
}

export async function fetchPatientById(id) {
  await delay(200);
  const patient = MOCK_PATIENTS.find((entry) => entry.id === id);
  if (!patient) throw new Error(`Patient ${id} not found`);
  return {
    ...patient,
    prescriptions: [...(PATIENT_PRESCRIPTIONS[id] || [])],
  };
}

export async function createPatient(data) {
  await delay(300);
  const newPatient = {
    id: generateId('p'),
    admittedAt: new Date().toISOString(),
    status: 'outpatient',
    priority: 'normal',
    queueType: 'OPD',
    slotTime: '16:00',
    vitals: {},
    ...data,
  };
  MOCK_PATIENTS = [newPatient, ...MOCK_PATIENTS];
  PATIENT_HISTORY[newPatient.id] = [];
  PATIENT_PRESCRIPTIONS[newPatient.id] = [];
  return newPatient;
}

export async function updatePatient(id, data) {
  await delay(250);
  const index = MOCK_PATIENTS.findIndex((patient) => patient.id === id);
  if (index === -1) throw new Error(`Patient ${id} not found`);
  MOCK_PATIENTS[index] = { ...MOCK_PATIENTS[index], ...data };
  return { ...MOCK_PATIENTS[index] };
}

export async function deletePatient(id) {
  await delay(200);
  MOCK_PATIENTS = MOCK_PATIENTS.filter((patient) => patient.id !== id);
  delete PATIENT_HISTORY[id];
  delete PATIENT_PRESCRIPTIONS[id];
  return { success: true };
}

export async function searchPatients(query) {
  await delay(180);
  const normalized = query.toLowerCase();
  return MOCK_PATIENTS.filter(
    (patient) =>
      patient.name.toLowerCase().includes(normalized) ||
      patient.diagnosis.toLowerCase().includes(normalized) ||
      patient.id.toLowerCase().includes(normalized) ||
      patient.bloodGroup.toLowerCase().includes(normalized)
  );
}

export async function fetchPatientHistory(patientId) {
  await delay(200);
  return [...(PATIENT_HISTORY[patientId] || [])];
}

export async function fetchPatientPrescriptions(patientId) {
  await delay(200);
  return [...(PATIENT_PRESCRIPTIONS[patientId] || [])].sort(
    (a, b) => new Date(b.prescribedAt) - new Date(a.prescribedAt)
  );
}

export function detectDrugConflicts(existingPrescriptions = [], medicineName = '') {
  const medicineNames = [...existingPrescriptions.map((item) => item.medicine.toLowerCase()), medicineName.toLowerCase()];
  return CONFLICT_RULES.filter((rule) =>
    rule.medicines.every((medicine) => medicineNames.includes(medicine))
  ).map((rule) => rule.message);
}

export async function addPatientPrescription(patientId, prescription) {
  await delay(250);
  const patient = MOCK_PATIENTS.find((entry) => entry.id === patientId);
  if (!patient) throw new Error(`Patient ${patientId} not found`);

  const existingPrescriptions = PATIENT_PRESCRIPTIONS[patientId] || [];
  const conflicts = detectDrugConflicts(existingPrescriptions, prescription.medicine);
  const entry = {
    id: generateId('rx'),
    prescribedAt: new Date().toISOString(),
    prescribedBy: prescription.prescribedBy || patient.doctor,
    conflict: conflicts.length > 0,
    ...prescription,
  };

  PATIENT_PRESCRIPTIONS[patientId] = [entry, ...existingPrescriptions];
  PATIENT_HISTORY[patientId] = [
    {
      id: generateId('hist'),
      date: new Date().toISOString().split('T')[0],
      type: 'Prescription',
      notes: `${entry.medicine} added (${entry.frequency})`,
      doctor: entry.prescribedBy,
    },
    ...(PATIENT_HISTORY[patientId] || []),
  ];

  return { prescription: entry, conflicts };
}
