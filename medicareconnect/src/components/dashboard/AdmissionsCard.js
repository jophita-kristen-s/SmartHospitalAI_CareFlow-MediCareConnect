import React, { useState } from "react";

const initialAdmissions = [
  { id: 1, name: "John Doe", age: 55, bloodGroup: "O+", status: "pending", avatar: "JD", color: "#4A90D9" },
  { id: 2, name: "Laura White", age: 50, room: "Room 204", status: "admitted", avatar: "LW", color: "#7ED321" },
];

const AdmissionsCard = () => {
  const [list, setList] = useState(initialAdmissions);

  const handleApprove = (id) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "admitted" } : p)));

  const handleReject = (id) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p)));

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>🏥</span>
        <span style={styles.title}>Admissions</span>
        <div style={styles.badge}>Prescription</div>
      </div>

      <div style={styles.list}>
        {list.map((p) => (
          <div key={p.id} style={styles.patientBox}>
            <div style={styles.topRow}>
              <div style={{ ...styles.avatar, background: p.color }}>
                {p.avatar}
              </div>
              <div style={styles.info}>
                <div style={styles.name}>
                  {p.name}
                  <span style={styles.age}> {p.age}</span>
                </div>
                {p.bloodGroup && (
                  <div style={styles.detail}>
                    Blood Group:&nbsp;
                    <span style={styles.highlight}>🅱 {p.bloodGroup}</span>
                  </div>
                )}
                {p.room && <div style={styles.detail}>{p.room}</div>}
              </div>
              <StatusBadge status={p.status} />
            </div>

            {p.status === "pending" && (
              <div style={styles.actions}>
                <button type="button" style={styles.approveBtn} onClick={() => handleApprove(p.id)}>
                  ✓ Approve
                </button>
                <button type="button" style={styles.rejectBtn} onClick={() => handleReject(p.id)}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scan History Alert */}
      <div style={styles.alertBox}>
        <span style={styles.alertDot} />
        <span style={styles.alertText}>Scan History Alert</span>
        <span style={styles.alertArrow}>›</span>
      </div>

      {/* QR Code placeholder */}
      <div style={styles.qrBox}>
        <div style={styles.qrPlaceholder}>
          <span style={{ fontSize: 40 }}>▦</span>
        </div>
        <button style={styles.scanBtn}>Scan Patient QR Code</button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    pending: { bg: "#FFF3CD", color: "#856404", label: "Pending" },
    admitted: { bg: "#D4EDDA", color: "#155724", label: "Admitted" },
    rejected: { bg: "#F8D7DA", color: "#721c24", label: "Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: 20,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
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
  title: { fontWeight: 700, fontSize: 15, color: "#1a2340", flex: 1 },
  badge: {
    background: "#EEF2FF",
    color: "#4A90D9",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
  },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  patientBox: {
    border: "1px solid #f0f2f8",
    borderRadius: 12,
    padding: "10px 12px",
  },
  topRow: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: 700, color: "#1a2340" },
  age: { color: "#8a94b2", fontWeight: 400 },
  detail: { fontSize: 11, color: "#8a94b2", marginTop: 2 },
  highlight: { color: "#4A90D9", fontWeight: 600 },
  actions: { display: "flex", gap: 8, marginTop: 10 },
  approveBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #28a745, #20c954)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "7px 0",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  rejectBtn: {
    flex: 1,
    background: "#fff",
    color: "#dc3545",
    border: "1px solid #dc3545",
    borderRadius: 8,
    padding: "7px 0",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  alertBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#FFF8E1",
    borderRadius: 10,
    padding: "8px 12px",
    marginTop: 14,
    cursor: "pointer",
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#F5A623",
    flexShrink: 0,
  },
  alertText: { flex: 1, fontSize: 12, fontWeight: 600, color: "#856404" },
  alertArrow: { color: "#F5A623", fontSize: 18 },
  qrBox: {
    marginTop: 14,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  qrPlaceholder: {
    width: 90,
    height: 90,
    background: "#f5f7ff",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4A90D9",
    border: "2px dashed #c5cde8",
  },
  scanBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #4A90D9, #357ABD)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 0",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
};

export default AdmissionsCard;