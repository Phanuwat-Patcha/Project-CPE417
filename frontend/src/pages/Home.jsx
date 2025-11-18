import React, { useState } from "react";

export default function Home() {
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");

  const handleNext = () => {
    if (!floor || !room) {
      alert("กรุณาเลือกชั้นและห้องให้ครบถ้วน");
      return;
    }
    // ไปหน้าถัดไปหรือบันทึกข้อมูล
    console.log("จองห้อง:", { floor, room });
  };

  const handleCancel = () => {
    setFloor("");
    setRoom("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3 style={styles.menuTitle}>เมนู</h3>
        <ul style={styles.menuList}>
          <li>จองห้องเรียน</li>
          <li>รายการจองห้อง</li>
          <li>ออกจากระบบ</li>
        </ul>
      </div>

      <div style={styles.main}>
        <h2 style={styles.header}>ระบบจองห้องเรียน</h2>

        <div style={styles.profile}>
          <p><strong>ชื่อ:</strong> ธันษา หมื่นศรี</p>
          <p><strong>รหัสอาจารย์:</strong> 65018219</p>
          <p><strong>เลขบัตรประชาชน:</strong> 1249900707059</p>
          <p><strong>คณะ:</strong> คณะเทคโนโลยีสารสนเทศ</p>
        
        </div>

        <div style={styles.form}>
          <label style={styles.label}>ชั้นที่ต้องการจอง <span style={styles.required}>*</span></label>
          <select style={styles.select} value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="">-- กรุณาเลือกชั้น --</option>
            <option value="1">ชั้น 3</option>
            <option value="2">ชั้น 4</option>
            <option value="3">ชั้น 6</option>
            <option value="4">ชั้น 7</option>
            <option value="5">ชั้น 9</option>
            <option value="6">ชั้น 10</option>
            <option value="7">ชั้น 11</option>
            <option value="8">ชั้น 12</option>
            <option value="9">ชั้น 16</option>
          </select>

          <label style={styles.label}>ห้องที่ต้องการจอง <span style={styles.required}>*</span></label>
          <select style={styles.select} value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="">-- กรุณาเลือกห้อง --</option>
            <option value="101">ห้อง 101</option>
            <option value="202">ห้อง 202</option>
            <option value="303">ห้อง 303</option>
          </select>

          <div style={styles.buttonGroup}>
            <button style={styles.nextButton} onClick={handleNext}>ถัดไป</button>
            <button style={styles.cancelButton} onClick={handleCancel}>ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#f2f2f2",
    padding: "20px",
    borderRight: "1px solid #ccc",
  },
  menuTitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    lineHeight: "2",
    color: "#007bff",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
  header: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#333",
  },
  profile: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "30px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  form: {
    maxWidth: "400px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  required: {
    color: "red",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  nextButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
