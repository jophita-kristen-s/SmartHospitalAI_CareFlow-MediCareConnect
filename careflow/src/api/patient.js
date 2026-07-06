// frontend-patient/src/api/patient.js

//import API from './index';

//export const getAppointments  = ()     => API.get('/patient/appointments');
//export const bookAppointment  = (data) => API.post('/patient/appointments', data);
//export const raiseEmergency   = (data) => API.post('/patient/emergency', data);
//export const getHistory       = ()     => API.get('/patient/history');
//export const getAdmissions    = ()     => API.get('/patient/admission');

import API from './index';

export const getAppointments   = ()     => API.get('/patient/appointments');
export const bookAppointment   = (data) => API.post('/patient/appointments', data);
export const raiseEmergency    = (data) => API.post('/patient/emergency', data);
export const getHistory        = ()     => API.get('/patient/history');
export const getAdmissions     = ()     => API.get('/patient/admission');