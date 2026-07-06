import React, { useState } from "react";

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([
    { id: 1, patient: "John Doe", time: "10:30 AM", status: "Admitted" },
    { id: 2, patient: "Emily Clark", time: "11:15 AM", status: "Emergency" },
  ]);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    // Simulate scan
    setTimeout(() => {
      const mock = {
        id: "P-" + Math.floor(Math.random() * 10000),
        name: "Mark Johnson",
        age: 45,
        bloodGroup: "A+",
        room: "ICU - 3",
      };
      setResult(mock);
      setHistory((prev) => [
        { id: Date.now(), patient: mock.name, time: new Date().toLocaleTimeString(), status: "Scanned" },
        ...prev,
      ]);
      setScanning(false);
    }, 2000);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>📷</span>
        <span style={styles.title}>QR Scanner</span>
      </div>

      {/* Scanner viewfinder */}
      <div style={styles.viewfinder}>
        {scanning ? (
          <div style={styles.scanningAnim}>
            <div style={styles.scanLine} />
            <p style={styles.scanText}>Scanning...</p>
          </div>
        ) : (
          <div style={styles.qrIcon}>▦</div>
        )}
        <div style={styles.corner} />
      </div>

      {/* Scan result */}
      {result && (
        <div style={styles.resultBox}>
          <div style={styles.resultHeader}>✅ Patient Found</div>
          <div style={styles.resultRow}><span style={styles.label}>ID</span><span>{result.id}</span></div>
          <div style={styles.resultRow}><span style={styles.label}>Name</span><span style={styles.bold}>{result.name}</span></div>
          <div style={styles.resultRow}><span style={styles.label}>Age</span><span>{result.age}</span></div>
          <div style={styles.resultRow}><span style={styles.label}>Blood Group</span><span style={styles.blood}>{result.bloodGroup}</span></div>
          <div style={styles.resultRow}><span style={styles.label}>Room</span><span>{result.room}</span></div>
        </div>
      )}

      <button
        style={{ ...styles.scanBtn, opacity: scanning ? 0.7 : 1 }}
        onClick={handleScan}
        disabled={scanning}
      >
        {scanning ? "Scanning..." : "Scan Patient QR Code"}
      </button>

      {/* Scan History */}
      <div style={styles.historySection}>
        <div style={styles.historyHeader}>
          <span style={styles.historyTitle}>Scan History</span>
          <span style={styles.alertTag}>Alert</span>
        </div>
        {history.map((h) => (
          <div key={h.id} style={styles.historyRow}>
            <div style={styles.historyDot} />
            <div style={styles.historyInfo}>
              <span style={styles.historyName}>{h.patient}</span>
              <span style={styles.historyTime}>{h.time}</span>
            </div>
            <span style={styles.historyStatus}>{h.status}</span>
          </div>
        ))}
      </div>
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
  header: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 },
  icon: { fontSize: 18 },
  title: { fontWeight: 700, fontSize: 15, color: "#1a2340" },
  viewfinder: {
    background: "#f5f7ff",
    borderRadius: 14,
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    border: "2px dashed #c5cde8",
    marginBottom: 14,
  },
  qrIcon: { fontSize: 70, color: "#4A90D9" },
  scanningAnim: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  scanLine: {
    width: "80%",
    height: 2,
    background: "linear-gradient(90deg, transparent, #4A90D9, transparent)",
    animation: "scan 1.5s ease-in-out infinite",
    position: "absolute",
    top: "40%",
  },
  scanText: { color: "#4A90D9", fontSize: 13, fontWeight: 600 },
  corner: {},
  resultBox: {
    background: "#F0FFF4",
    border: "1px solid #c3e6cb",
    borderRadius: 12,
    padding: "10px 14px",
    marginBottom: 12,
  },
  resultHeader: { fontWeight: 700, color: "#28a745", fontSize: 13, marginBottom: 8 },
  resultRow: { display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 },
  label: { color: "#8a94b2" },
  bold: { fontWeight: 600, color: "#1a2340" },
  blood: { fontWeight: 700, color: "#E74C6F" },
  scanBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #4A90D9, #357ABD)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 0",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 14,
  },
  historySection: {},
  historyHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  historyTitle: { fontWeight: 700, fontSize: 13, color: "#1a2340", flex: 1 },
  alertTag: {
    background: "#FFF8E1",
    color: "#F5A623",
    borderRadius: 20,
    padding: "2px 8px",
    fontSize: 10,
    fontWeight: 700,
  },
  historyRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 0",
    borderBottom: "1px solid #f0f2f8",
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4A90D9",
    flexShrink: 0,
  },
  historyInfo: { flex: 1, display: "flex", flexDirection: "column" },
  historyName: { fontSize: 12, fontWeight: 600, color: "#1a2340" },
  historyTime: { fontSize: 11, color: "#8a94b2" },
  historyStatus: {
    fontSize: 11,
    color: "#28a745",
    fontWeight: 600,
    background: "#D4EDDA",
    padding: "2px 8px",
    borderRadius: 20,
  },
};

export default QRScanner;