// ─────────────────────────────────────────────
// CareFlow Mock Service — All app data
// ─────────────────────────────────────────────

export const MOCK_USER = {
  id: 'CF-2024-001',
  name: 'Gopika Sharma',
  email: 'gopika@careflow.in',
  password: 'Care@123',
  age: 28,
  phone: '+91 98401 55678',
  bloodGroup: 'B+',
  avatar: null,
  hasInsurance: true,
  insuranceProvider: 'Star Health Insurance',
  policyNumber: 'SH-7724019',
  isESIC: true,
  esicNumber: 'ES-10-41-123456-000',
  allergies: 'Penicillin, Sulfa drugs',
  chronicDiseases: 'Mild Asthma',
  emergencyContact: 'Ramesh Sharma (Father) · +91 94401 77890',
};

export const MOCK_MEDICATIONS = [
  { id: 1, name: 'Salbutamol', dosage: '2 puffs', frequency: 'As needed', color: '#00bcd4' },
  { id: 2, name: 'Cetirizine', dosage: '10mg', frequency: 'Once nightly', color: '#10b981' },
  { id: 3, name: 'Vitamin D3', dosage: '60,000 IU', frequency: 'Weekly', color: '#f59e0b' },
];

export const MOCK_SURGERIES = [
  {
    id: 1,
    name: 'Appendectomy',
    date: '2021-08-12',
    hospital: 'JIPMER, Puducherry',
    doctor: 'Dr. Aravind Rajan',
    notes: 'Laparoscopic procedure. Full recovery in 7 days. No complications.',
  },
];

export const MOCK_REPORTS = [
  { id: 1, name: 'CBC Blood Panel', date: '2024-02-10', validityDays: 90 },
  { id: 2, name: 'Chest X-Ray', date: '2024-01-05', validityDays: 365 },
  { id: 3, name: 'Spirometry Report', date: '2023-12-01', validityDays: 180 },
  { id: 4, name: 'HbA1c Test', date: '2024-03-01', validityDays: 60 },
];

export const MOCK_APPOINTMENTS = [
  {
    id: 1,
    hospital: 'JIPMER',
    treatment: 'General Consultation',
    department: 'General Medicine',
    date: '2024-03-28',
    time: '10:30 AM',
    doctor: 'Dr. Priya Nair',
    status: 'upcoming',
  },
  {
    id: 2,
    hospital: 'GH Puducherry',
    treatment: 'Therapy',
    department: 'Pulmonology',
    date: '2024-02-14',
    time: '02:00 PM',
    doctor: 'Dr. Suresh Babu',
    status: 'completed',
  },
];

export const MOCK_HISTORY = [
  {
    date: 'Feb 2024',
    doctor: 'Dr. Priya Nair',
    type: 'General Consultation',
    notes: 'Mild asthma flare-up. Prescribed Salbutamol inhaler. Follow-up in 3 months.',
    icon: '🫁',
  },
  {
    date: 'Dec 2023',
    doctor: 'Dr. Kavita Iyer',
    type: 'Allergy Review',
    notes: 'Cetirizine continued. Avoid Penicillin-based antibiotics. Allergy panel clear.',
    icon: '🩺',
  },
  {
    date: 'Aug 2023',
    doctor: 'Dr. Suresh Babu',
    type: 'Annual Checkup',
    notes: 'All vitals normal. Vitamin D deficiency noted. Started D3 supplementation.',
    icon: '❤️',
  },
];

export const HOSPITALS_PUDUCHERRY = [
  {
    id: 'jipmer',
    name: 'JIPMER',
    full: 'Jawaharlal Inst. of PGR',
    location: 'Dhanvantari Nagar, Pondicherry',
    type: 'Government · ESIC Approved',
    rating: 4.7,
    color: '#00bcd4',
    icon: '🏥',
  },
  {
    id: 'ghpudu',
    name: 'GH Puducherry',
    full: 'Government General Hospital',
    location: 'Rue Victor Simonel, Pondicherry',
    type: 'Government · Free Services',
    rating: 4.2,
    color: '#10b981',
    icon: '🏨',
  },
  {
    id: 'manipal',
    name: 'Manipal Hospital',
    full: 'Manipal Hospitals Pondicherry',
    location: 'Cuddalore Rd, Pondicherry',
    type: 'Private · Insurance Accepted',
    rating: 4.5,
    color: '#f59e0b',
    icon: '🏪',
  },
  {
    id: 'altius',
    name: 'Altius Hospital',
    full: 'Altius Super Speciality',
    location: 'Anna Nagar, Pondicherry',
    type: 'Private · 24/7',
    rating: 4.3,
    color: '#a855f7',
    icon: '🏬',
  },
];

export const TREATMENT_TYPES = [
  { id: 'general', label: 'General Consultation', icon: 'Stethoscope', color: '#00bcd4' },
  { id: 'therapy', label: 'Therapy', icon: 'Activity', color: '#10b981' },
  { id: 'chemo', label: 'Chemotherapy', icon: 'Pill', color: '#a855f7' },
  { id: 'surgery', label: 'Surgery Consultation', icon: 'Scissors', color: '#ef4444' },
  { id: 'followup', label: 'Emergency Follow-up', icon: 'RefreshCw', color: '#f59e0b' },
];

export const DEPARTMENTS = [
  { id: 'cardio', label: 'Cardiology', icon: 'Heart', color: '#ef4444' },
  { id: 'onco', label: 'Oncology', icon: 'Pill', color: '#a855f7' },
  { id: 'neuro', label: 'Neurology', icon: 'Brain', color: '#3b82f6' },
  { id: 'ortho', label: 'Orthopedics', icon: 'Bone', color: '#f59e0b' },
  { id: 'pulmo', label: 'Pulmonology', icon: 'Wind', color: '#06b6d4' },
  { id: 'gm', label: 'General Medicine', icon: 'Stethoscope', color: '#10b981' },
];

export const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','02:00 PM','02:30 PM',
  '03:00 PM','03:30 PM','04:00 PM','04:30 PM',
];

export const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
