require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
