import React from "react";
import StatsCard from "../components/dashboard/StatsCard";
import EmergencyPanel from "../components/dashboard/EmergencyPanel";
import BedManagement from "../components/dashboard/BedManagement";
import PatientQueue from "../components/dashboard/PatientQueue";
import AdmissionsCard from "../components/dashboard/AdmissionsCard";
import PrescriptionPanel from "../components/dashboard/PrescriptionPanel";
import QRScanner from "../components/dashboard/QRScanner";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.heading}>
            <span style={styles.headingBold}>Medical Data</span> Integration Dashboard
          </h1>
          <p style={styles.subtitle}>A unified view for emergency response, beds, admissions, and patient history.</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        <StatsCard icon="PT" label="Live Stats" value={12} color="#F5A623" bgColor="#FFF8EE" />
        <StatsCard icon="ER" label="Emergency" value={2} color="#E74C6F" bgColor="#FFF0F3" />
        <StatsCard icon="BD" label="Available" value={8} color="#4A90D9" bgColor="#EEF4FF" />
      </div>

      <div style={styles.mainPanels}>
        <div style={styles.mainPanelLarge}>
          <EmergencyPanel />
        </div>
        <div style={styles.mainPanelMed}>
          <BedManagement />
        </div>
        <div style={styles.mainPanelMed}>
          <PatientQueue />
        </div>
      </div>

      <div style={styles.bottomGrid}>
        <div style={styles.miniCard}>
          <EmergencyMini />
        </div>
        <div style={styles.miniCard}>
          <BedMini />
        </div>
        <div style={styles.miniCard}>
          <PatientQueue />
        </div>
        <div style={styles.miniCard}>
          <AdmissionsCard />
        </div>
      </div>

      <div style={styles.utilsRow}>
        <AdmissionsManagerCard name="John Doe" blood="O+" age={55} label="Admissions Manager" />
        <AdmissionsManagerCard name="Laura White" room="Room 204" label="Admissions Manager" secondary />
        <PrescriptionPanel />
        <QRScanner />
      </div>
    </div>
  );
};

const EmergencyMini = () => (
  <div>
    <div style={miniStyles.header}>
      <span>ER</span>
      <span style={miniStyles.title}>Emergency</span>
      <span style={miniStyles.tag}>Real-Time</span>
    </div>
    <div style={{ marginTop: 10 }}>
      <div style={miniStyles.statLine}>
        <span style={miniStyles.statNum}>12</span>
        <span style={miniStyles.statLabel}>Patients Waiting</span>
      </div>
      <div style={miniStyles.progressBar}>
        <div style={{ ...miniStyles.progressFill, width: "75%", background: "#F5A623" }} />
      </div>
      <div style={{ ...miniStyles.statLine, marginTop: 8 }}>
        <span style={{ ...miniStyles.statNum, color: "#E74C6F" }}>2</span>
        <span style={miniStyles.statLabel}>Emergency Alerts</span>
      </div>
      <div style={miniStyles.progressBar}>
        <div style={{ ...miniStyles.progressFill, width: "20%", background: "#E74C6F" }} />
      </div>
      <div style={{ ...miniStyles.statLine, marginTop: 8 }}>
        <span style={{ ...miniStyles.statNum, color: "#4A90D9" }}>8</span>
        <span style={miniStyles.statLabel}>Available Beds</span>
      </div>
    </div>
  </div>
);

const BedMini = () => (
  <div>
    <div style={miniStyles.header}>
      <span>BD</span>
      <span style={miniStyles.title}>Bed Manage.</span>
      <span style={miniStyles.tag}>ICU & General</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
      <div style={miniStyles.donut}>
        <span style={miniStyles.donutText}>67%</span>
      </div>
      <div>
        <div style={miniStyles.bedStat}>
          <span style={miniStyles.bedNum}>5 / 8</span>
          <span style={miniStyles.bedLabel}>ICU Beds</span>
        </div>
        <div style={{ ...miniStyles.bedStat, marginTop: 6 }}>
          <span style={miniStyles.bedNum}>21 / 25</span>
          <span style={miniStyles.bedLabel}>General Beds</span>
        </div>
      </div>
    </div>
    <div style={{ marginTop: 10 }}>
      {[{ label: "Occupied", val: 12, color: "#4A90D9" }, { label: "Available", val: 21, color: "#28a745" }].map((item) => (
        <div key={item.label} style={miniStyles.statRow}>
          <span style={{ ...miniStyles.dot, background: item.color }} />
          <span style={miniStyles.statRowLabel}>{item.label}</span>
          <span style={miniStyles.statRowNum}>{item.val}</span>
        </div>
      ))}
    </div>
    <button style={miniStyles.btn}>Update Status</button>
  </div>
);

const AdmissionsManagerCard = ({ name, blood, age, room, label, secondary }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", minWidth: 180 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span>AD</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: "#1a2340" }}>{label}</span>
      {secondary && <span style={{ fontSize: 12 }}>+</span>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: secondary ? "#7ED321" : "#4A90D9", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
        {name.split(" ").map((part) => part[0]).join("")}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a2340" }}>{name} {age && <span style={{ color: "#8a94b2", fontWeight: 400 }}>{age}</span>}</div>
        {blood && <div style={{ fontSize: 11, color: "#4A90D9" }}>Blood Group: {blood}</div>}
        {room && <div style={{ fontSize: 11, color: "#8a94b2" }}>{room}</div>}
      </div>
    </div>
    <button style={{ marginTop: 12, width: "100%", background: "none", border: "1px solid #e0e4ef", borderRadius: 8, padding: "7px 0", fontSize: 12, color: "#4A90D9", cursor: "pointer", fontWeight: 600 }}>
      Track Admissions &gt;
    </button>
  </div>
);

const miniStyles = {
  header: { display: "flex", alignItems: "center", gap: 8 },
  title: { fontWeight: 700, fontSize: 14, color: "#1a2340", flex: 1 },
  tag: { background: "#EEF4FF", color: "#4A90D9", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600 },
  statLine: { display: "flex", alignItems: "center", gap: 8 },
  statNum: { fontSize: 20, fontWeight: 800, color: "#1a2340" },
  statLabel: { fontSize: 12, color: "#8a94b2" },
  progressBar: { height: 6, background: "#f0f2f8", borderRadius: 10, marginTop: 4 },
  progressFill: { height: "100%", borderRadius: 10 },
  donut: {
    width: 70, height: 70, borderRadius: "50%",
    background: "conic-gradient(#4A90D9 0% 67%, #e0e4ef 67% 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  donutText: { fontSize: 13, fontWeight: 700, color: "#1a2340", background: "#fff", borderRadius: "50%", padding: "8px" },
  bedStat: { display: "flex", flexDirection: "column" },
  bedNum: { fontSize: 14, fontWeight: 700, color: "#1a2340" },
  bedLabel: { fontSize: 10, color: "#8a94b2" },
  statRow: { display: "flex", alignItems: "center", gap: 8, padding: "4px 0" },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  statRowLabel: { flex: 1, fontSize: 12, color: "#8a94b2" },
  statRowNum: { fontSize: 13, fontWeight: 700, color: "#1a2340" },
  btn: {
    marginTop: 10, width: "100%",
    background: "linear-gradient(135deg, #4A90D9, #357ABD)",
    color: "#fff", border: "none", borderRadius: 10,
    padding: "9px 0", fontWeight: 600, fontSize: 12, cursor: "pointer",
  },
};

const styles = {
  container: { padding: "24px 28px", background: "#F4F6FF", minHeight: "100vh" },
  pageHeader: { marginBottom: 24 },
  heading: { fontSize: 26, fontWeight: 400, color: "#1a2340", margin: 0 },
  headingBold: { fontWeight: 800 },
  subtitle: { color: "#8a94b2", marginTop: 4, fontSize: 14 },
  statsRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  mainPanels: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  mainPanelLarge: { flex: "2 1 320px", minWidth: 0 },
  mainPanelMed: { flex: "1 1 220px", minWidth: 0 },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  miniCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "18px 16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  utilsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 16,
  },
};

export default Dashboard;
