import React, { useState } from "react";

const MOCK_ADMISSIONS = [
  { id: "A-001", patient: "John Doe", age: 55, blood: "O+", ward: "ICU", room: "ICU-3", doctor: "Dr. Smith", date: "2024-11-01", status: "admitted" },
  { id: "A-002", patient: "Laura White", age: 50, blood: "A+", ward: "General", room: "Room 204", doctor: "Dr. Patel", date: "2024-11-02", status: "admitted" },
  { id: "A-003", patient: "Robert King", age: 34, blood: "B-", ward: "OPD", room: "OPD-7", doctor: "Dr. Lee", date: "2024-11-03", status: "pending" },
  { id: "A-004", patient: "Anna Cruz", age: 29, blood: "AB+", ward: "General", room: "Room 108", doctor: "Dr. Smith", date: "2024-11-04", status: "discharged" },
];

const STATUS_MAP = {
  admitted: { bg: "#D4EDDA", color: "#155724", label: "Admitted" },
  pending: { bg: "#FFF3CD", color: "#856404", label: "Pending" },
  discharged: { bg: "#D1ECF1", color: "#0c5460", label: "Discharged" },
};

const Admissions = () => {
  const [admissions, setAdmissions] = useState(MOCK_ADMISSIONS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const statuses = ["All", "admitted", "pending", "discharged"];

  const filtered = admissions.filter((a) => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search);
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = (id) => {
    setAdmissions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "admitted" } : a))
    );
  };

  const handleDischarge = (id) => {
    setAdmissions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "discharged" } : a))
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Admissions Manager</h2>

      {/* Summary */}
      <div style={styles.summaryRow}>
        {statuses.slice(1).map((s) => {
          const count = admissions.filter((a) => a.status === s).length;
          const sm = STATUS_MAP[s];
          return (
            <div key={s} style={{ ...styles.summaryCard, background: sm.bg }}>
              <div style={{ ...styles.summaryNum, color: sm.color }}>{count}</div>
              <div style={styles.summaryLabel}>{sm.label}</div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          style={styles.searchInput}
          placeholder="🔍  Search by patient name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.filterRow}>
          {statuses.map((s) => (
            <button
              key={s}
              style={{ ...styles.filterBtn, ...(filterStatus === s ? styles.filterBtnActive : {}) }}
              onClick={() => setFilterStatus(s)}
            >
              {s === "All" ? "All" : STATUS_MAP[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {["ID", "Patient", "Age", "Blood", "Ward", "Room", "Doctor", "Date", "Status", "Actions"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const sm = STATUS_MAP[a.status];
              return (
                <tr key={a.id} style={styles.tr}>
                  <td style={styles.td}>{a.id}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: "#1a2340" }}>{a.patient}</td>
                  <td style={styles.td}>{a.age}</td>
                  <td style={{ ...styles.td, color: "#E74C6F", fontWeight: 700 }}>{a.blood}</td>
                  <td style={styles.td}>{a.ward}</td>
                  <td style={styles.td}>{a.room}</td>
                  <td style={styles.td}>{a.doctor}</td>
                  <td style={styles.td}>{a.date}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: sm.bg, color: sm.color }}>
                      {sm.label}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {a.status === "pending" && (
                        <button style={styles.approveBtn} onClick={() => handleApprove(a.id)}>
                          Approve
                        </button>
                      )}
                      {a.status === "admitted" && (
                        <button style={styles.dischargeBtn} onClick={() => handleDischarge(a.id)}>
                          Discharge
                        </button>
                      )}
                      {a.status === "discharged" && (
                        <span style={styles.doneTag}>Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ ...styles.td, textAlign: "center", color: "#8a94b2", padding: "30px 0" }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px 28px", background: "#F4F6FF", minHeight: "100vh" },
  pageTitle: { fontSize: 22, fontWeight: 800, color: "#1a2340", marginBottom: 20 },
  summaryRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  summaryCard: {
    flex: "1 1 120px", borderRadius: 14, padding: "16px 18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  summaryNum: { fontSize: 28, fontWeight: 800 },
  summaryLabel: { fontSize: 12, color: "#444", marginTop: 2, fontWeight: 600, textTransform: "capitalize" },
  controls: { marginBottom: 18 },
  searchInput: {
    width: "100%", maxWidth: 360, padding: "10px 14px",
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
  tableWrapper: { background: "#fff", borderRadius: 16, overflow: "auto", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#F4F6FF" },
  th: { padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#8a94b2", borderBottom: "1px solid #f0f2f8" },
  tr: { borderBottom: "1px solid #f8f9fc", transition: "background 0.15s" },
  td: { padding: "12px 14px", fontSize: 13, color: "#444" },
  statusBadge: {
    borderRadius: 20, padding: "3px 10px",
    fontSize: 11, fontWeight: 700,
  },
  actions: { display: "flex", gap: 8 },
  approveBtn: {
    padding: "5px 12px", background: "linear-gradient(135deg, #28a745, #20c954)",
    color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 11, cursor: "pointer",
  },
  dischargeBtn: {
    padding: "5px 12px", background: "#EEF4FF", color: "#4A90D9",
    border: "1px solid #4A90D9", borderRadius: 8, fontWeight: 600, fontSize: 11, cursor: "pointer",
  },
  doneTag: { color: "#8a94b2", fontSize: 12, fontStyle: "italic" },
};

export default Admissions;