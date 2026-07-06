// src/api/hospital.js
import API from './index';

export const getBeds          = (hospitalId) => API.get(`/hospital/${hospitalId}/beds`);
export const getQueue         = (hospitalId) => API.get(`/hospital/${hospitalId}/queue`);
export const respondEmergency = (id)         => API.patch(`/hospital/emergency/${id}/respond`);