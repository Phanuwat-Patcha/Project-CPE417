import React from "react";

export default function Login() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.university}>มหาวิทยาลัยศรีปทุม<br />SRIPATUM UNIVERSITY</h2>
        <h3 style={styles.title}>Reservation System</h3>
        <p style={styles.welcome}>ยินดีต้อนรับเข้าสู่ระบบจองการใช้ห้อง</p>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input type="text" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input type="password" style={styles.input} />
          </div>

          <button style={styles.button}>LOGIN</button>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    color: "#444",
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
