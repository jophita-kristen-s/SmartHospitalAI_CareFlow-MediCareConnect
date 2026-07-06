export const AUTH_TOKEN_KEY = 'hcf_auth_token';
export const CURRENT_USER_KEY = 'hcf_current_user';
export const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000;

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT_MS = 15000;

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
};

export const PATIENT_STATUSES = ['admitted', 'discharged', 'outpatient', 'deceased'];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const WARDS = ['ICU', 'General', 'Pediatrics', 'Maternity', 'Orthopedics', 'Neurology', 'Oncology', 'Cardiology'];

export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  NORMAL: 'normal',
};

export const EMERGENCY_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_TREATMENT: 'in_treatment',
  RESOLVED: 'resolved',
};

export const ALERT_TYPES = {
  CODE_BLUE: 'code_blue',
  CODE_RED: 'code_red',
  AMBULANCE: 'ambulance',
  EQUIPMENT: 'equipment',
  STAFF: 'staff',
};

export const BED_STATUSES = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  RESERVED: 'reserved',
};

export const BED_TYPES = ['ICU', 'General', 'Private', 'Semi-Private', 'Emergency'];
export const MAX_ICU_BEDS = 8;
export const MAX_GENERAL_BEDS = 25;

export const BOOKING_STATUSES = {
  CONFIRMED: 'confirmed',
  WAITING: 'waiting',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const APPOINTMENT_TYPES = ['OPD', 'ICU Review', 'Follow-Up', 'Emergency', 'Routine Check-Up', 'Consultation'];
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
];
export const APPOINTMENT_DURATION_OPTIONS = [15, 30, 45, 60];

export const DEPARTMENTS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Internal Medicine', 'General Surgery', 'Gynecology', 'Dermatology',
  'Psychiatry', 'Radiology', 'Anesthesiology', 'Emergency Medicine',
];

export const DOSAGE_FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Every 6 hours', 'Every 8 hours', 'As needed (PRN)', 'Weekly'];
export const MEDICINE_ROUTES = ['Oral', 'IV', 'IM', 'Subcutaneous', 'Topical', 'Inhaled', 'Sublingual'];

export const ITEMS_PER_PAGE = 20;
export const TOAST_DURATION_MS = 4000;
export const POLLING_INTERVAL_MS = 30000;

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Emergency', path: '/emergency', icon: 'emergency' },
  { label: 'Beds', path: '/beds', icon: 'bed' },
  { label: 'Patient Queue', path: '/patients', icon: 'queue' },
  { label: 'Admissions', path: '/admissions', icon: 'admissions' },
  { label: 'Prescriptions', path: '/booking', icon: 'prescriptions' },
  { label: 'QR Scanner', path: '/qr-scanner', icon: 'qr' },
];

export const APP_NAME = 'MedicareConnect';
export const APP_VERSION = '1.0.0';
export const DEFAULT_AVATAR_COLOR = '#3b82f6';
