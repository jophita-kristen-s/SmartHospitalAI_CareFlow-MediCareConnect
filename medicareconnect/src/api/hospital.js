import API from './index';

// hospitalId is optional for queue — gets all appointments
export const getQueue         = (hospitalId) => API.get(`/hospital/${hospitalId}/queue`);
export const getBeds          = (hospitalId) => API.get(`/hospital/${hospitalId}/beds`);
export const respondEmergency = (id)         => API.patch(`/hospital/emergency/${id}/respond`);