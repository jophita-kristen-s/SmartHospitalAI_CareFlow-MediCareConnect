// bedService.js — API layer for bed management

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

/**
 * Fetch all beds with their status
 * @returns {Promise<{ icu: Object[], general: Object[] }>}
 */
export const fetchAllBeds = async () => {
  const res = await fetch(`${BASE_URL}/beds`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch beds");
  return res.json();
};

/**
 * Fetch beds by ward
 * @param {"ICU"|"General"} ward
 */
export const fetchBedsByWard = async (ward) => {
  const res = await fetch(`${BASE_URL}/beds?ward=${ward}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch ${ward} beds`);
  return res.json();
};

/**
 * Get a single bed's details
 * @param {string|number} bedId
 */
export const fetchBedById = async (bedId) => {
  const res = await fetch(`${BASE_URL}/beds/${bedId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Bed not found");
  return res.json();
};

/**
 * Assign a patient to a bed
 * @param {string|number} bedId
 * @param {string} patientId
 * @param {"ICU"|"General"} ward
 */
export const assignBed = async (bedId, patientId, ward) => {
  const res = await fetch(`${BASE_URL}/beds/${bedId}/assign`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ patientId, ward }),
  });
  if (!res.ok) throw new Error("Failed to assign bed");
  return res.json();
};

/**
 * Release a bed (mark as available)
 * @param {string|number} bedId
 */
export const releaseBed = async (bedId) => {
  const res = await fetch(`${BASE_URL}/beds/${bedId}/release`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to release bed");
  return res.json();
};

/**
 * Get bed statistics summary
 * @returns {{ icuTotal, icuOccupied, generalTotal, generalOccupied, available }}
 */
export const fetchBedStats = async () => {
  const res = await fetch(`${BASE_URL}/beds/stats`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch bed stats");
  return res.json();
};

/**
 * Update bed details (ward, room number, etc.)
 * @param {string|number} bedId
 * @param {Object} updates
 */
export const updateBed = async (bedId, updates) => {
  const res = await fetch(`${BASE_URL}/beds/${bedId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update bed");
  return res.json();
};