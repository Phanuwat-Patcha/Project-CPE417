import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  // โหลดข้อมูลโปรไฟล์อาจารย์
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teachers/65018219");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("โหลดข้อมูลโปรไฟล์ไม่สำเร็จ:", error);
      }
    };
    fetchProfile();
  }, []);

  const generateRooms = (floorNumber) => {
    if (!floorNumber) return [];
    const base = floorNumber * 100;
    return Array.from({ length: 5 }, (_, i) => base + i + 1);
  };

  const handleNext = () => {
    if (!floor || !room || !date || !startTime || !endTime) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);
    const diffHours = (end - start) / (1000 * 60 * 60);
    if (diffHours <= 0) return alert("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
    if (diffHours > 3) return alert("ไม่สามารถจองเกิน 3 ชั่วโมงได้");

    navigate("/booking", {
      state: { floor, room, date, startTime, endTime },
    });
  };

  const handleCancel = () => {
    setFloor("");
    setRoom("");
    setDate("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={styles.menuTitle}>เมนู</h3>
        <ul style={styles.menuList}>
          <li>
            <Link to="/Home" style={styles.menuItem}>จองห้องเรียน</Link>
          </li>
          <li>
            <Link to="/booking" style={styles.menuItem}>รายการจองห้อง</Link>
          </li>
          <li>
            <span style={styles.menuItem} onClick={() => navigate("/")}>
              ออกจากระบบ
            </span>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <h2 style={styles.header}>ระบบจองห้องเรียน</h2>

        <div style={styles.profile}>
          {profile ? (
            <>
              <p><strong>ชื่อ:</strong> {profile.name}</p>
              <p><strong>รหัสอาจารย์:</strong> {profile.teacherId}</p>
              <p><strong>เลขบัตรประชาชน:</strong> {profile.citizenId}</p>
              <p><strong>คณะ:</strong> {profile.faculty}</p>
            </>
          ) : (
            <p>กำลังโหลดข้อมูล...</p>
          )}
        </div>

        <div style={styles.formGrid}>
          <div style={styles.formItem}>
            <label style={styles.label}>ชั้นที่ต้องการจอง <span style={styles.required}>*</span></label>
            <select
              style={styles.input}
              value={floor}
              onChange={(e) => { setFloor(e.target.value); setRoom(""); }}
            >
              <option value="">-- กรุณาเลือกชั้น --</option>
              {[1,2,3,4,5].map(f => <option key={f} value={f}>ชั้น {f}</option>)}
            </select>
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>ห้องที่ต้องการจอง <span style={styles.required}>*</span></label>
            <select
              style={styles.input}
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              disabled={!floor}
            >
              <option value="">-- กรุณาเลือกห้อง --</option>
              {generateRooms(Number(floor)).map(r => <option key={r} value={r}>ห้อง {r}</option>)}
            </select>
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>วันที่จอง <span style={styles.required}>*</span></label>
            <input type="date" style={styles.input} value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>เวลาเริ่ม <span style={styles.required}>*</span></label>
            <input type="time" style={styles.input} value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>เวลาสิ้นสุด <span style={styles.required}>*</span></label>
            <input type="time" style={styles.input} value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>

          <div style={{ ...styles.formItem, gridColumn: "span 2", display: "flex", gap: "12px" }}>
            <button style={styles.nextButton} onClick={handleNext}>ถัดไป</button>
            <button style={styles.cancelButton} onClick={handleCancel}>ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "'Helvetica Neue', sans-serif", background: "#f7f7f7" },
  sidebar: {
    width: "220px",
    background: "#fff",
    padding: "30px 20px",
    borderRight: "1px solid #eee",
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
  },
  menuTitle: { fontSize: "18px", marginBottom: "20px", color: "#333" },
  menuList: { listStyle: "none", padding: 0 },
  menuItem: {
    display: "block",
    padding: "10px 0",
    color: "#555",
    textDecoration: "none",
    fontWeight: 500,
    cursor: "pointer",
    transition: "0.2s",
  },
  main: { flex: 1, padding: "40px 50px" },
  header: { fontSize: "24px", marginBottom: "25px", color: "#222" },
  profile: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    color: "#333",
    lineHeight: 1.6,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  formItem: {
    display: "flex",
    flexDirection: "column",
  },
  label: { display: "block", marginBottom: "8px", fontWeight: 600, color: "#444", fontSize: "14px" },
  required: { color: "#e74c3c" },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s",
  },
  nextButton: {
    flex: 1,
    padding: "12px 0",
    backgroundColor: "#2e7accff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
  cancelButton: {
    flex: 1,
    padding: "12px 0",
    backgroundColor: "#797a7bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
};
