import { AUTH_TOKEN_KEY, CURRENT_USER_KEY } from '../utils/constants';
import { delay } from '../utils/helpers';

// Mock user database — replace with real API calls
const MOCK_USERS = [
  {
    id: 'u001',
    name: 'Dr. Smith',
    email: 'dr.smith@hospital.com',
    password: 'password123',
    role: 'doctor',
    department: 'Cardiology',
    avatar: null,
    specialization: 'Cardiologist',
    phone: '+1 555-0101',
  },
  {
    id: 'u002',
    name: 'Nurse Johnson',
    email: 'nurse.johnson@hospital.com',
    password: 'password123',
    role: 'nurse',
    department: 'ICU',
    avatar: null,
    specialization: null,
    phone: '+1 555-0102',
  },
  {
    id: 'u003',
    name: 'Admin User',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    avatar: null,
    specialization: null,
    phone: '+1 555-0103',
  },
];

/**
 * Login user with email and password.
 * Returns user object (without password) and stores token.
 */
export async function loginUser({ email, password }) {
  await delay(600); // Simulate network latency

  const found = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) {
    throw new Error('Invalid email or password. Please try again.');
  }

  const { password: _pw, ...safeUser } = found;
  const token = btoa(`${safeUser.id}:${Date.now()}`); // Simple mock token

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

  return safeUser;
}

/**
 * Register a new user account.
 */
export async function signupUser({ name, email, password, role = 'nurse', department }) {
  await delay(800);

  const exists = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    id: `u${Date.now()}`,
    name,
    email,
    role,
    department: department || 'General',
    avatar: null,
    specialization: null,
    phone: '',
  };

  const token = btoa(`${newUser.id}:${Date.now()}`);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return newUser;
}

/**
 * Log out the current user.
 */
export function logoutUser() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Get the currently stored user from localStorage.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Get stored auth token.
 */
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Update profile details of the logged-in user.
 */
export async function updateUserProfile(userId, updates) {
  await delay(500);
  const current = getCurrentUser();
  if (!current || current.id !== userId) {
    throw new Error('Unauthorized');
  }
  const updated = { ...current, ...updates };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Change user password.
 */
export async function changePassword({ currentPassword, newPassword }) {
  await delay(500);
  const current = getCurrentUser();
  if (!current) throw new Error('Not authenticated');

  const user = MOCK_USERS.find(u => u.id === current.id);
  if (!user || user.password !== currentPassword) {
    throw new Error('Current password is incorrect.');
  }

  // In real app: PATCH /api/auth/password
  return { success: true, message: 'Password updated successfully.' };
}