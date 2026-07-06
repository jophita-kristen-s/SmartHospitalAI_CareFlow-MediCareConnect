import { delay, generateId, formatDate } from '../utils/helpers';

let MOCK_BOOKINGS = [
  {
    id: 'b001', patientId: 'p001', patientName: 'Richard Davis',
    doctorId: 'u001', doctorName: 'Dr. Smith', department: 'Cardiology',
    date: '2024-11-15', time: '10:30', duration: 30,
    type: 'OPD', status: 'confirmed', notes: 'Follow-up for Fleaker Illness',
    createdAt: '2024-11-10T08:00:00Z',
  },
  {
    id: 'b002', patientId: 'p003', patientName: 'Paul Brown',
    doctorId: 'u001', doctorName: 'Dr. Smith', department: 'Orthopedics',
    date: '2024-11-15', time: '11:00', duration: 30,
    type: 'OPD', status: 'confirmed', notes: 'Fracture follow-up',
    createdAt: '2024-11-11T09:00:00Z',
  },
  {
    id: 'b003', patientId: 'p004', patientName: 'Patricia Lee',
    doctorId: 'u001', doctorName: 'Dr. Smith', department: 'Internal Medicine',
    date: '2024-11-15', time: '11:15', duration: 45,
    type: 'OPD', status: 'waiting', notes: 'Diabetes review',
    createdAt: '2024-11-08T09:15:00Z',
  },
  {
    id: 'b004', patientId: 'p002', patientName: 'Sarah Miller',
    doctorId: 'u001', doctorName: 'Dr. Smith', department: 'Cardiology',
    date: '2024-11-16', time: '09:00', duration: 60,
    type: 'ICU Review', status: 'confirmed', notes: 'Post-surgery cardiac assessment',
    createdAt: '2024-11-09T14:30:00Z',
  },
];

const AVAILABLE_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'];

const DOCTORS = [
  { id: 'u001', name: 'Dr. Smith', department: 'Cardiology', available: true },
  { id: 'u004', name: 'Dr. Adams', department: 'Orthopedics', available: true },
  { id: 'u005', name: 'Dr. Patel', department: 'Internal Medicine', available: false },
  { id: 'u006', name: 'Dr. Chen', department: 'Neurology', available: true },
  { id: 'u007', name: 'Dr. Williams', department: 'Pediatrics', available: true },
];

export async function fetchBookings({ date, doctorId, status } = {}) {
  await delay(400);
  let result = [...MOCK_BOOKINGS];
  if (date) result = result.filter(b => b.date === date);
  if (doctorId) result = result.filter(b => b.doctorId === doctorId);
  if (status) result = result.filter(b => b.status === status);
  return result.sort((a, b) => a.time.localeCompare(b.time));
}

export async function fetchBookingById(id) {
  await delay(300);
  const booking = MOCK_BOOKINGS.find(b => b.id === id);
  if (!booking) throw new Error(`Booking ${id} not found`);
  return { ...booking };
}

export async function createBooking(data) {
  await delay(600);
  // Check for conflicts
  const conflict = MOCK_BOOKINGS.find(
    b => b.doctorId === data.doctorId && b.date === data.date && b.time === data.time && b.status !== 'cancelled'
  );
  if (conflict) throw new Error('This time slot is already booked. Please choose another.');

  const newBooking = {
    id: generateId('b'),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    duration: 30,
    ...data,
  };
  MOCK_BOOKINGS = [newBooking, ...MOCK_BOOKINGS];
  return newBooking;
}

export async function updateBookingStatus(id, status) {
  await delay(300);
  const idx = MOCK_BOOKINGS.findIndex(b => b.id === id);
  if (idx === -1) throw new Error(`Booking ${id} not found`);
  MOCK_BOOKINGS[idx] = { ...MOCK_BOOKINGS[idx], status };
  return { ...MOCK_BOOKINGS[idx] };
}

export async function cancelBooking(id, reason = '') {
  await delay(300);
  return updateBookingStatus(id, 'cancelled');
}

export async function fetchAvailableSlots(doctorId, date) {
  await delay(400);
  const booked = MOCK_BOOKINGS
    .filter(b => b.doctorId === doctorId && b.date === date && b.status !== 'cancelled')
    .map(b => b.time);
  return AVAILABLE_SLOTS.filter(slot => !booked.includes(slot));
}

export async function fetchDoctors() {
  await delay(300);
  return [...DOCTORS];
}

export async function fetchBookingStats() {
  await delay(300);
  const today = formatDate(new Date(), 'YYYY-MM-DD');
  const todayBookings = MOCK_BOOKINGS.filter(b => b.date === today);
  return {
    total: MOCK_BOOKINGS.length,
    today: todayBookings.length,
    confirmed: MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length,
    waiting: MOCK_BOOKINGS.filter(b => b.status === 'waiting').length,
    completed: MOCK_BOOKINGS.filter(b => b.status === 'completed').length,
    cancelled: MOCK_BOOKINGS.filter(b => b.status === 'cancelled').length,
  };
}