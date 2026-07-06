import React, { useState } from "react";

const patients = [
  { id: 1, name: "Richard Davis", condition: "Fleaker Illness", waitTime: 60, avatar: "RD", color: "#4A90D9" },
  { id: 2, name: "Sarah Miller", condition: "Heart Disease", waitTime: 104, avatar: "SM", color: "#E74C6F" },
  { id: 3, name: "Paul Brown", condition: "90 nredi", waitTime: 113, avatar: "PB", color: "#F5A623" },
  { id: 4, name: "Patricia Lee", condition: "30 nredi", waitTime: 115, avatar: "PL", color: "#7ED321" },
];

const PatientQueue = () => {
  const [filter, setFilter] = useState("OPD List");

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.icon}>👥</span>
          <span style={styles.title}>Patient Queue</span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option>OPD List</option>
          <option>IPD List</option>
          <option>Emergency</option>
        </select>
      </div>

      <div style={styles.list}>
        {patients.map((p) => (
          <div key={p.id} style={styles.row}>
            <div style={{ ...styles.avatar, background: p.color }}>
              {p.avatar}
            </div>
            <div style={styles.info}>
              <div style={styles.name}>{p.name}</div>
              <div style={styles.condition}>{p.condition}</div>
            </div>
            <div style={styles.wait}>
              <span style={styles.waitNum}>{p.waitTime}</span>
              <span style={styles.waitUnit}>min</span>
            </div>
            <div style={styles.actionIcons}>
              <button style={styles.iconBtn} title="View">📋</button>
            </div>
          </div>
        ))}
      </div>

      <button style={styles.updateBtn}>Update Status</button>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  icon: { fontSize: 18 },
  title: { fontWeight: 700, fontSize: 15, color: "#1a2340" },
  select: {
    border: "1px solid #e0e4ef",
    borderRadius: 8,
    padding: "4px 8px",
    fontSize: 12,
    color: "#444",
    background: "#f5f7ff",
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 0",
    borderBottom: "1px solid #f0f2f8",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: 600, color: "#1a2340" },
  condition: { fontSize: 11, color: "#8a94b2", marginTop: 2 },
  wait: { display: "flex", flexDirection: "column", alignItems: "center" },
  waitNum: { fontSize: 14, fontWeight: 700, color: "#4A90D9" },
  waitUnit: { fontSize: 10, color: "#8a94b2" },
  actionIcons: { display: "flex", gap: 4 },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    padding: 2,
  },
  updateBtn: {
    marginTop: 14,
    width: "100%",
    background: "linear-gradient(135deg, #4A90D9, #357ABD)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 0",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
};

export default PatientQueue;