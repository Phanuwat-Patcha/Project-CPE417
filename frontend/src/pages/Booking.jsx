import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function Booking() {
  const { state: booking } = useLocation();
  const navigate = useNavigate();

  // state สำหรับเมนูที่ active
  const [activeMenu, setActiveMenu] = useState("Booking");

  const InfoRow = ({ label, value }) => (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={styles.rowValue}>{value}</span>
    </div>
  );

  return (
    <div style={styles.container}>
      
      {/* LEFT SIDEBAR */}
      <aside style={styles.sidebar}>
        <h3 style={styles.menuTitle}>เมนู</h3>
        <ul style={styles.menuList}>
          <li>
            <Link 
              to="/Home" 
              style={{ 
                ...styles.menuItem, 
                color: activeMenu === "Home" ? "#2e7acc" : "#444" 
              }}
              onClick={() => setActiveMenu("Home")}
            >
              จองห้องเรียน
            </Link>
          </li>
          <li>
            <Link 
              to="/booking" 
              style={{ 
                ...styles.menuItem, 
                color: activeMenu === "Booking" ? "#2e7acc" : "#444" 
              }}
              onClick={() => setActiveMenu("Booking")}
            >
              รายการจองห้อง
            </Link>
          </li>
          <li>
            <span 
              style={{ 
                ...styles.menuItem, 
                color: activeMenu === "Logout" ? "#2e7acc" : "#444" 
              }} 
              onClick={() => {
                navigate("/");
                setActiveMenu("Logout");
              }}
            >
              ออกจากระบบ
            </span>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.header}>รายการจอง</h2>

          {!booking ? (
            <p style={{ textAlign: "center", color: "#777" }}>
              ไม่มีข้อมูลการจอง
            </p>
          ) : (
            <div style={styles.infoContainer}>
              <InfoRow label="ชั้น" value={booking.floor} />
              <InfoRow label="ห้อง" value={booking.room} />
              <InfoRow label="วันที่" value={booking.date} />
              <InfoRow
                label="เวลา"
                value={`${booking.startTime} - ${booking.endTime}`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f7f7f7",
    fontFamily: "Inter, sans-serif",
  },

  /* SIDEBAR */
  sidebar: {
    width: "220px",
    background: "#fff",
    padding: "30px 20px",
    borderRight: "1px solid #eee",
  },

  menuTitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#333",
  },

  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  menuItem: {
    display: "block",
    padding: "10px 0",
    textDecoration: "none",
    fontWeight: 500,
    cursor: "pointer",
    transition: "0.2s",
  },

  /* MAIN */
  main: {
    flex: 1,
    padding: "40px",
    display: "block",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    background: "#fff",
    padding: "32px",
    borderRadius: "14px",
    border: "1px solid #e3e3e3",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },

  header: {
    marginBottom: "24px",
    fontSize: "22px",
    fontWeight: 600,
    color: "#222",
    textAlign: "center",
  },

  infoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
  },

  rowLabel: {
    color: "#666",
  },

  rowValue: {
    fontWeight: 500,
  },
};
