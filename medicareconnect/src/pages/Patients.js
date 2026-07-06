import React, { useState } from "react";

const MOCK_PATIENTS = [
  { id: "P-1001", name: "Richard Davis", age: 60, condition: "Fleaker Illness", ward: "OPD", status: "active", blood: "B+", avatar: "RD", color: "#4A90D9" },
  { id: "P-1002", name: "Sarah Miller", age: 48, condition: "Heart Disease", ward: "ICU", status: "critical", blood: "O-", avatar: "SM", color: "#E74C6F" },
  { id: "P-1003", name: "Paul Brown", age: 55, condition: "Diabetes", ward: "General", status: "stable", blood: "A+", avatar: "PB", color: "#F5A623" },
  { id: "P-1004", name: "Patricia Lee", age: 62, condition: "Hypertension", ward: "OPD", status: "stable", blood: "AB+", avatar: "PL", color: "#7ED321" },
  { id: "P-1005", name: "Mark Johnson", age: 45, condition: "Chest Pain", ward: "Emergency", status: "critical", blood: "O+", avatar: "MJ", color: "#9B59B6" },
  { id: "P-1006", name: "Emily Clark", age: 62, condition: "Severe Burn", ward: "ICU", status: "critical", blood: "A-", avatar: "EC", color: "#E67E22" },
];

const STATUS_COLORS = {
  active: { bg: "#D4EDDA", color: "#155724" },
  stable: { bg: "#D1ECF1", color: "#0c5460" },
  critical: { bg: "#F8D7DA", color: "#721c24" },
};

const Patients = () => {
  const [search, setSearch] = useState("");
  const [filterWard, setFilterWard] = useState("All");
  const [selected, setSelected] = useState(null);

  const wards = ["All", ...new Set(MOCK_PATIENTS.map((p) => p.ward))];

  const filtered = MOCK_PATIENTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchWard = filterWard === "All" || p.ward === filterWard;
    return matchSearch && matchWard;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Patients</h2>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          style={styles.searchInput}
          placeholder="🔍  Search patient name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.filterRow}>
          {wards.map((w) => (
            <button
              key={w}
              style={{ ...styles.filterBtn, ...(filterWard === w ? styles.filterBtnActive : {}) }}
              onClick={() => setFilterWard(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.layout}>
        {/* Patient List */}
        <div style={styles.list}>
          {filtered.map((p) => {
            const sc = STATUS_COLORS[p.status] || STATUS_COLORS.active;
            return (
              <div
                key={p.id}
                style={{
                  ...styles.card,
                  boxShadow: selected?.id === p.id ? "0 0 0 2px #4A90D9" : "0 2px 8px rgba(0,0,0,0.06)",
                }}
                onClick={() => setSelected(p)}
              >
                <div style={{ ...styles.avatar, background: p.color }}>{p.avatar}</div>
                <div style={styles.info}>
                  <div style={styles.name}>{p.name}</div>
                  <div style={styles.meta}>{p.id} · {p.ward} · {p.condition}</div>
                </div>
                <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                  {p.status}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={styles.empty}>No patients found.</div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={styles.detail}>
            <div style={{ ...styles.detailAvatar, background: selected.color }}>
              {selected.avatar}
            </div>
            <h3 style={styles.detailName}>{selected.name}</h3>
            <p style={styles.detailId}>{selected.id}</p>
            <div style={styles.detailGrid}>
              {[
                { label: "Age", value: selected.age },
                { label: "Blood Group", value: selected.blood },
                { label: "Ward", value: selected.ward },
                { label: "Condition", value: selected.condition },
                { label: "Status", value: selected.status },
              ].map((row) => (
                <div key={row.label} style={styles.detailRow}>
                  <span style={styles.detailLabel}>{row.label}</span>
                  <span style={styles.detailValue}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={styles.detailActions}>
              <button style={styles.viewBtn}>View History</button>
              <button style={styles.editBtn}>Edit Record</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px 28px", background: "#F4F6FF", minHeight: "100vh" },
  pageTitle: { fontSize: 22, fontWeight: 800, color: "#1a2340", marginBottom: 20 },
  controls: { marginBottom: 20 },
  searchInput: {
    width: "100%", maxWidth: 400, padding: "10px 14px",
    border: "1px solid #e0e4ef", borderRadius: 12, fontSize: 13,
    color: "#1a2340", outline: "none", background: "#fff",
    boxSizing: "border-box", marginBottom: 12,
  },
  filterRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  filterBtn: {
    padding: "6px 16px", borderRadius: 20, border: "1px solid #e0e4ef",
    background: "#fff", color: "#8a94b2", fontWeight: 600, fontSize: 12, cursor: "pointer",
  },
  filterBtnActive: { background: "#4A90D9", color: "#fff", border: "1px solid #4A90D9" },
  layout: { display: "flex", gap: 20, alignItems: "flex-start" },
  list: { flex: 1, display: "flex", flexDirection: "column", gap: 10 },
  card: {
    background: "#fff", borderRadius: 14, padding: "14px 16px",
    display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
    transition: "box-shadow 0.2s",
  },
  avatar: {
    width: 42, height: 42, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: 700, color: "#1a2340" },
  meta: { fontSize: 11, color: "#8a94b2", marginTop: 3 },
  statusBadge: {
    borderRadius: 20, padding: "3px 10px",
    fontSize: 11, fontWeight: 700, textTransform: "capitalize",
  },
  empty: { textAlign: "center", color: "#8a94b2", padding: "40px 0" },
  detail: {
    width: 260, background: "#fff", borderRadius: 16,
    padding: "24px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    flexShrink: 0, textAlign: "center",
  },
  detailAvatar: {
    width: 64, height: 64, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 800, fontSize: 22, margin: "0 auto 12px",
  },
  detailName: { fontSize: 18, fontWeight: 800, color: "#1a2340", margin: 0 },
  detailId: { fontSize: 12, color: "#8a94b2", margin: "4px 0 16px" },
  detailGrid: { textAlign: "left", display: "flex", flexDirection: "column", gap: 10 },
  detailRow: {
    display: "flex", justifyContent: "space-between",
    borderBottom: "1px solid #f0f2f8", paddingBottom: 8,
  },
  detailLabel: { fontSize: 12, color: "#8a94b2" },
  detailValue: { fontSize: 13, fontWeight: 600, color: "#1a2340", textTransform: "capitalize" },
  detailActions: { display: "flex", gap: 10, marginTop: 18 },
  viewBtn: {
    flex: 1, background: "#EEF4FF", color: "#4A90D9",
    border: "none", borderRadius: 10, padding: "9px 0",
    fontWeight: 600, fontSize: 12, cursor: "pointer",
  },
  editBtn: {
    flex: 1, background: "linear-gradient(135deg, #4A90D9, #357ABD)",
    color: "#fff", border: "none", borderRadius: 10,
    padding: "9px 0", fontWeight: 600, fontSize: 12, cursor: "pointer",
  },
};

export default Patients;