// src/pages/Booking.jsx
import React from "react";
import { useLocation } from "react-router-dom";

export default function Booking() {
  const location = useLocation();
  const booking = location.state || {}; // ข้อมูลจาก navigate

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>รายการจองของคุณ</h1>
      {booking.floor ? (
        <div>
          <p>ชั้น: {booking.floor}</p>
          <p>ห้อง: {booking.room}</p>
          <p>วันที่: {booking.date}</p>
          <p>เวลา: {booking.startTime} - {booking.endTime}</p>
        </div>
      ) : (
        <p>คุณยังไม่ได้จองห้อง</p>
      )}
    </div>
  );
}
