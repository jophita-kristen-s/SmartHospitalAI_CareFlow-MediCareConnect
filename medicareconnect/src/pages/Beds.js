import React, { useState } from "react";
import { useBeds } from "../context/BedContext";

const WARDS = ["All", "ICU", "General"];

const Beds = () => {
  const { icu, general, totalAvailable, assignBed, releaseBed } = useBeds();
  const [activeWard, setActiveWard] = useState("All");
  const [selectedBed, setSelectedBed] = useState(null);

  const beds =
    activeWard === "ICU"
      ? icu.beds
      : activeWard === "General"
      ? general.beds
      : [...icu.beds.map((b) => ({ ...b, ward: "ICU" })), ...general.beds.map((b) => ({ ...b, ward: "General" }))];

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Bed Management</h2>

      {/* Summary Cards */}
      <div style={styles.summaryRow}>
        {[
          { label: "ICU Beds", occ: icu.occupied, total: icu.total, color: "#E74C6F", bg: "#FFF0F3" },
          { label: "General Beds", occ: general.occupied, total: general.total, color: "#4A90D9", bg: "#EEF4FF" },
          { label: "Total Available", occ: totalAvailable, total: icu.total + general.total, color: "#28a745", bg: "#F0FFF4" },
        ].map((s) => (
          <div key={s.label} style={{ ...styles.summaryCard, background: s.bg }}>
            <div style={{ ...styles.summaryNum, color: s.color }}>{s.occ}</div>
            <div style={styles.summaryLabel}>{s.label}</div>
            <div style={styles.summaryTotal}>/ {s.total} total</div>
            <div style={styles.progressBg}>
              <div style={{ ...styles.progressFill, width: `${(s.occ / s.total) * 100}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Ward Filter */}
      <div style={styles.filterRow}>
        {WARDS.map((w) => (
          <button
            key={w}
            style={{ ...styles.filterBtn, ...(activeWard === w ? styles.filterBtnActive : {}) }}
            onClick={() => setActiveWard(w)}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Bed Grid */}
      <div style={styles.bedGrid}>
        {beds.map((bed) => (
          <div
            key={`${bed.ward}-${bed.id}`}
            style={{
              ...styles.bedCell,
              background: bed.occupied ? "#FFF0F3" : "#F0FFF4",
              border: `2px solid ${bed.occupied ? "#E74C6F" : "#28a745"}`,
              cursor: "pointer",
            }}
            onClick={() => setSelectedBed(selectedBed?.id === bed.id ? null : bed)}
          >
            <div style={{ fontSize: 22 }}>{bed.occupied ? "🛏️" : "🛏"}</div>
            <div style={styles.bedLabel}>{bed.ward} #{bed.id}</div>
            <div style={{ ...styles.bedStatus, color: bed.occupied ? "#E74C6F" : "#28a745" }}>
              {bed.occupied ? "Occupied" : "Available"}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedBed && (
        <div style={styles.detailPanel}>
          <h3 style={styles.detailTitle}>Bed Detail — {selectedBed.ward} #{selectedBed.id}</h3>
          <p style={styles.detailInfo}>
            Status: <strong>{selectedBed.occupied ? "Occupied" : "Available"}</strong>
          </p>
          {selectedBed.patientId && (
            <p style={styles.detailInfo}>Patient ID: <strong>{selectedBed.patientId}</strong></p>
          )}
          <div style={styles.detailActions}>
            {selectedBed.occupied ? (
              <button
                style={styles.releaseBtn}
                onClick={() => { releaseBed(selectedBed.ward, selectedBed.id); setSelectedBed(null); }}
              >
                Release Bed
              </button>
            ) : (
              <button
                style={styles.assignBtn}
                onClick={() => { assignBed(selectedBed.ward, selectedBed.id, "P-" + Math.floor(Math.random() * 9000 + 1000)); setSelectedBed(null); }}
              >
                Assign Bed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "24px 28px", background: "#F4F6FF", minHeight: "100vh" },
  pageTitle: { fontSize: 22, fontWeight: 800, color: "#1a2340", marginBottom: 20 },
  summaryRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  summaryCard: {
    flex: "1 1 160px", borderRadius: 16, padding: "18px 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  summaryNum: { fontSize: 32, fontWeight: 800 },
  summaryLabel: { fontSize: 13, fontWeight: 600, color: "#1a2340", marginTop: 2 },
  summaryTotal: { fontSize: 11, color: "#8a94b2" },
  progressBg: { height: 6, background: "#e0e4ef", borderRadius: 10, marginTop: 8 },
  progressFill: { height: "100%", borderRadius: 10, transition: "width 0.3s" },
  filterRow: { display: "flex", gap: 10, marginBottom: 20 },
  filterBtn: {
    padding: "7px 18px", borderRadius: 20, border: "1px solid #e0e4ef",
    background: "#fff", color: "#8a94b2", fontWeight: 600, fontSize: 13, cursor: "pointer",
  },
  filterBtnActive: { background: "#4A90D9", color: "#fff", border: "1px solid #4A90D9" },
  bedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  bedCell: {
    borderRadius: 12, padding: "14px 8px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    transition: "transform 0.15s",
  },
  bedLabel: { fontSize: 11, fontWeight: 600, color: "#1a2340" },
  bedStatus: { fontSize: 10, fontWeight: 700 },
  detailPanel: {
    background: "#fff", borderRadius: 16, padding: "20px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  detailTitle: { fontWeight: 800, color: "#1a2340", marginBottom: 10 },
  detailInfo: { fontSize: 14, color: "#444", marginBottom: 6 },
  detailActions: { display: "flex", gap: 12, marginTop: 14 },
  releaseBtn: {
    padding: "9px 22px", background: "#FFF0F3", color: "#E74C6F",
    border: "1px solid #E74C6F", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer",
  },
  assignBtn: {
    padding: "9px 22px", background: "linear-gradient(135deg, #28a745, #20c954)",
    color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer",
  },
};

export default Beds;