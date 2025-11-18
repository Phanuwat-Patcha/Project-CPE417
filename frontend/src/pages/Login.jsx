import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SPULogo from "../assets/SPU-LOGOFULL.png";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // ตรวจสอบว่า username เป็นตัวเลข 8 หลัก
    const usernameValid = /^\d{8}$/.test(username);
    // ตรวจสอบว่า password เป็นตัวเลข 13 หลัก
    const passwordValid = /^\d{13}$/.test(password);

    if (!usernameValid) {
      alert("กรุณากรอก Username เป็นตัวเลข 8 หลัก");
      return;
    }

    if (!passwordValid) {
      alert("กรุณากรอก Password เป็นตัวเลข 13 หลัก");
      return;
    }

    // ถ้าผ่านเงื่อนไขทั้งหมด → ไปหน้า Home
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <img src={SPULogo} alt="SPU Logo" style={styles.logo} />
      <div style={styles.content}>
        <h2 style={styles.university}>มหาวิทยาลัยศรีปทุม<br />SRIPATUM UNIVERSITY</h2>
        <h3 style={styles.title}>Reservation System</h3>
        <p style={styles.welcome}>ยินดีต้อนรับเข้าสู่ระบบจองการใช้ห้อง</p>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={handleLogin}>LOGIN</button>
        </div>

        <p style={styles.warning}>ห้ามเข้าใช้บริการห้อง เกินกว่าจำนวนที่กำหนด</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    width: "100vw",
    height: "100vh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    position: "absolute",
    top: "20px",
    left: "40px",
    width: "120px",
    height: "100px",
    objectFit: "contain",
  },
  content: {
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
  },
  university: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  title: {
    fontSize: "18px",
    marginBottom: "5px",
    color: "#333",
  },
  welcome: {
    fontSize: "16px",
    marginBottom: "30px",
    color: "#666",
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "rgba(227, 227, 227, 1)",
    color: "#000",
  },
  button: {
    width: "30%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  warning: {
    marginTop: "20px",
    color: "red",
    fontWeight: "bold",
    fontSize: "14px",
  },
};
