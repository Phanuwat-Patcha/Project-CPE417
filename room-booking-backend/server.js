require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));
app.use('/api/teachers', require('./routes/teacher'));
app.use('/api/admins', require('./routes/admin'));
app.use('/api/rooms', require('./routes/room'));
app.use('/api/bookings', require('./routes/booking'));

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",  // ถ้าใช้ frontend จริงให้ใส่ domain
    methods: ["GET", "POST"]
  }
});

// When a client connects
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // รับข้อมูลจาก frontend
  socket.on("messageFromClient", (data) => {
    console.log("📩 จาก client:", data);
  });

  // ส่งข้อมูลให้ client ทุกคน
  socket.emit("welcome", "ยินดีต้อนรับจาก backend 🚀");

  // เมื่อ client ออกจากระบบ
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = io;
