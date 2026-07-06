// src/api/medicare.js
/*import API from './index';

export const getPrescriptions = ()       => API.get('/medicare/prescriptions');
export const createPrescription = (data) => API.post('/medicare/prescriptions', data);
export const checkDrugs       = (drugs, patientId) =>
  API.post('/medicare/drug-check', { drugs, patientId });
export const getMedicalHistory = (patientId) =>
  API.get(`/medicare/history/${patientId}`);
export const scanQR            = (patientId) =>
  API.get(`/medicare/qr/${patientId}`);  // returns full patient profile*/

import API from './index';

export const scanQR            = (patientId)        => API.get(`/medicare/qr/${patientId}`);
export const getPrescriptions  = ()                 => API.get('/medicare/prescriptions');
export const createPrescription= (data)             => API.post('/medicare/prescriptions', data);
export const checkDrugs        = (drugs, patientId) => API.post('/medicare/drug-check', { drugs, patientId });
export const getMedicalHistory = (patientId)        => API.get(`/medicare/history/${patientId}`);