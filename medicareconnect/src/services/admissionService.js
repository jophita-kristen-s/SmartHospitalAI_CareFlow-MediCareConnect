import { delay } from '../utils/helpers';

let MOCK_ADMISSIONS = [
  { id: 'a001', patientId: 'p005', patientName: 'John Doe', age: 55, bloodGroup: 'O+', ward: 'ICU', room: '', doctor: 'Dr. Smith', requestedAt: '2026-03-26T08:15:00Z', status: 'pending' },
  { id: 'a002', patientId: 'p006', patientName: 'Laura White', age: 50, bloodGroup: 'B+', ward: 'General', room: 'G-204', doctor: 'Dr. Adams', requestedAt: '2026-03-25T16:20:00Z', status: 'admitted' },
  { id: 'a003', patientId: 'p004', patientName: 'Patricia Lee', age: 55, bloodGroup: 'AB+', ward: 'General', room: '', doctor: 'Dr. Chen', requestedAt: '2026-03-26T09:40:00Z', status: 'pending' },
  { id: 'a004', patientId: 'p001', patientName: 'Richard Davis', age: 45, bloodGroup: 'O+', ward: 'General', room: 'G-101', doctor: 'Dr. Smith', requestedAt: '2026-03-24T10:30:00Z', status: 'discharged' },
];

export async function fetchAdmissions(filters = {}) {
  await delay(200);
  let admissions = [...MOCK_ADMISSIONS];
  if (filters.status && filters.status !== 'all') admissions = admissions.filter((item) => item.status === filters.status);
  if (filters.ward && filters.ward !== 'all') admissions = admissions.filter((item) => item.ward === filters.ward);
  return admissions.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
}

export async function fetchAdmissionById(admissionId) {
  await delay(150);
  const admission = MOCK_ADMISSIONS.find((item) => item.id === admissionId);
  if (!admission) throw new Error('Admission not found');
  return { ...admission };
}

export async function createAdmission(data) {
  await delay(200);
  const entry = {
    id: `a${Date.now()}`,
    requestedAt: new Date().toISOString(),
    status: 'pending',
    room: '',
    ...data,
  };
  MOCK_ADMISSIONS = [entry, ...MOCK_ADMISSIONS];
  return entry;
}

export async function approveAdmission(admissionId, updates = {}) {
  await delay(200);
  const index = MOCK_ADMISSIONS.findIndex((item) => item.id === admissionId);
  if (index === -1) throw new Error('Failed to approve admission');
  MOCK_ADMISSIONS[index] = {
    ...MOCK_ADMISSIONS[index],
    status: 'admitted',
    approvedAt: new Date().toISOString(),
    ...updates,
  };
  return { ...MOCK_ADMISSIONS[index] };
}

export async function rejectAdmission(admissionId, reason = '') {
  await delay(180);
  const index = MOCK_ADMISSIONS.findIndex((item) => item.id === admissionId);
  if (index === -1) throw new Error('Failed to reject admission');
  MOCK_ADMISSIONS[index] = {
    ...MOCK_ADMISSIONS[index],
    status: 'rejected',
    rejectionReason: reason,
  };
  return { ...MOCK_ADMISSIONS[index] };
}

export async function dischargePatient(admissionId, data = {}) {
  await delay(200);
  const index = MOCK_ADMISSIONS.findIndex((item) => item.id === admissionId);
  if (index === -1) throw new Error('Failed to discharge patient');
  MOCK_ADMISSIONS[index] = {
    ...MOCK_ADMISSIONS[index],
    status: 'discharged',
    dischargedAt: new Date().toISOString(),
    ...data,
  };
  return { ...MOCK_ADMISSIONS[index] };
}

export async function updateAdmission(admissionId, updates) {
  await delay(180);
  const index = MOCK_ADMISSIONS.findIndex((item) => item.id === admissionId);
  if (index === -1) throw new Error('Failed to update admission');
  MOCK_ADMISSIONS[index] = { ...MOCK_ADMISSIONS[index], ...updates };
  return { ...MOCK_ADMISSIONS[index] };
}

export async function fetchAdmissionStats() {
  await delay(150);
  return {
    total: MOCK_ADMISSIONS.length,
    pending: MOCK_ADMISSIONS.filter((item) => item.status === 'pending').length,
    admitted: MOCK_ADMISSIONS.filter((item) => item.status === 'admitted').length,
    discharged: MOCK_ADMISSIONS.filter((item) => item.status === 'discharged').length,
  };
}
