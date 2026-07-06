import React, { useState } from "react";

const PrescriptionPanel = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Amoxicillin 500mg", dose: "3x daily", conflict: false },
    { id: 2, name: "Metformin 850mg", dose: "2x daily", conflict: true },
    { id: 3, name: "Atorvastatin 20mg", dose: "1x daily", conflict: false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dose: "" });

  const handleAdd = () => {
    if (!newMed.name.trim()) return;
    setMedicines((prev) => [
      ...prev,
      { id: Date.now(), ...newMed, conflict: false },
    ]);
    setNewMed({ name: "", dose: "" });
    setShowAdd(false);
  };

  const conflicts = medicines.filter((m) => m.conflict);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>💊</span>
        <span style={styles.title}>Prescription Panel</span>
      </div>

      {/* Drug Conflict Alert */}
      {conflicts.length > 0 && (
        <div style={styles.conflictBanner}>
          <span>⚠️</span>
          <span style={styles.conflictText}>
            Drug Conflict Alert: {conflicts.map((c) => c.name).join(", ")}
          </span>
        </div>
      )}

      {/* Medicine List */}
      <div style={styles.list}>
        {medicines.map((med) => (
          <div
            key={med.id}
            style={{
              ...styles.medRow,
              borderLeft: med.conflict ? "3px solid #E74C6F" : "3px solid #28a745",
            }}
          >
            <div style={styles.medIcon}>{med.conflict ? "⚠️" : "✅"}</div>
            <div style={styles.medInfo}>
              <div style={styles.medName}>{med.name}</div>
              <div style={styles.medDose}>{med.dose}</div>
            </div>
            {med.conflict && (
              <span style={styles.conflictTag}>Conflict</span>
            )}
          </div>
        ))}
      </div>

      {/* Add Medicine */}
      {showAdd ? (
        <div style={styles.addForm}>
          <input
            style={styles.input}
            placeholder="Medicine name..."
            value={newMed.name}
            onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Dosage (e.g. 2x daily)"
            value={newMed.dose}
            onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
          />
          <div style={styles.formActions}>
            <button style={styles.confirmBtn} onClick={handleAdd}>Add</button>
            <button style={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button style={styles.addBtn} onClick={() => setShowAdd(true)}>
          + Add Medicine
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "18px 16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    minWidth: 240,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  icon: { fontSize: 18 },
  title: { fontWeight: 700, fontSize: 15, color: "#1a2340" },
  conflictBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#FFF0F3",
    border: "1px solid #F8C8D4",
    borderRadius: 10,
    padding: "8px 12px",
    marginBottom: 12,
  },
  conflictText: { fontSize: 12, color: "#E74C6F", fontWeight: 600 },
  list: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 },
  medRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f9faff",
    borderRadius: 10,
    padding: "10px 12px",
  },
  medIcon: { fontSize: 16 },
  medInfo: { flex: 1 },
  medName: { fontSize: 13, fontWeight: 600, color: "#1a2340" },
  medDose: { fontSize: 11, color: "#8a94b2", marginTop: 2 },
  conflictTag: {
    background: "#FFF0F3",
    color: "#E74C6F",
    borderRadius: 20,
    padding: "2px 8px",
    fontSize: 10,
    fontWeight: 700,
  },
  addBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #28a745, #20c954)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 0",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  addForm: { display: "flex", flexDirection: "column", gap: 8 },
  input: {
    border: "1px solid #e0e4ef",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 12,
    color: "#1a2340",
    outline: "none",
  },
  formActions: { display: "flex", gap: 8 },
  confirmBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #28a745, #20c954)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 0",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    background: "#fff",
    color: "#8a94b2",
    border: "1px solid #e0e4ef",
    borderRadius: 8,
    padding: "8px 0",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
};

export default PrescriptionPanel;