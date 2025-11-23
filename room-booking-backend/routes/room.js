const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');   // ใช้ตรวจสอบห้องว่าง
const auth = require('../middleware/authMiddleware');
const router = express.Router();

/* 🔹 GET available rooms
   - Query: ?date=YYYY-MM-DD&start_time=HH:MM&end_time=HH:MM
   - คืน available_rooms + unavailable_rooms
   - ต้องประกาศก่อน /:id เพื่อป้องกัน route conflict
*/
router.get('/available', async (req, res) => {
  try {
    const { date, start_time, end_time } = req.query;

    if (!date || !start_time || !end_time) {
      return res.status(400).json({ message: 'date, start_time, end_time required' });
    }

    const dateOnly = new Date(date); dateOnly.setHours(0,0,0,0);
    const nextDay = new Date(dateOnly); nextDay.setDate(nextDay.getDate() + 1);

    const bookings = await Booking.find({
      booking_date: { $gte: dateOnly, $lt: nextDay },
      status: { $in: ['pending', 'approved'] }
    });

    const toMinutes = t => {
      const [h,m] = t.split(':').map(Number);
      return h*60 + m;
    };
    const S2 = toMinutes(start_time);
    const E2 = toMinutes(end_time);

    const busyRoomIds = new Set();

    bookings.forEach(b => {
      const S1 = toMinutes(b.start_time);
      const E1 = toMinutes(b.end_time);
      if (Math.max(S1,S2) < Math.min(E1,E2)) busyRoomIds.add(b.room_id.toString());
    });

    const freeRooms = await Room.find({ _id: { $nin: Array.from(busyRoomIds) } });

    res.json({
      available_rooms: freeRooms,
      unavailable_rooms: Array.from(busyRoomIds)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🔹 GET all rooms
   - ใช้สำหรับดึง list ห้องทั้งหมด
*/
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🔹 GET room by ID */
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🔹 CREATE room (admin/system_admin) */
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin','system_admin'].includes(req.user.role))
      return res.status(403).json({ message: 'Forbidden' });

    const { room_name, building, floor, equipment, status } = req.body;
    const room = await Room.create({ room_name, building, floor, equipment, status });

    res.status(201).json({ message:'Room created', room });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

/* 🔹 UPDATE room (admin/system_admin) */
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin','system_admin'].includes(req.user.role))
      return res.status(403).json({ message: 'Forbidden' });

    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ message:'Updated', room });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

/* 🔹 DELETE room (admin/system_admin) */
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!['admin','system_admin'].includes(req.user.role))
      return res.status(403).json({ message: 'Forbidden' });

    // ถ้าต้องการเช็คว่า "ห้องที่มีการจองอยู่ห้ามลบ" ให้เพิ่มเงื่อนไขนี้
    const hasBooking = await Booking.exists({ room_id:req.params.id, status:{$in:['pending','approved']} });
    if(hasBooking) return res.status(400).json({ message:'Cannot delete room with existing bookings' });

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message:'Deleted' });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
