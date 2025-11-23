const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const SystemAdmin = require('../models/SystemAdmin');
const auth = require('../middleware/authMiddleware');
const { isOverlap } = require('../utils/timeUtils');

const router = express.Router();

/**
 * ฟังก์ชัน Helper
 * ใช้สำหรับแปลง role → model name (string)
 * เพื่อใช้เก็บใน field userModel ของ Booking
 */
function roleToModelName(role) {
  if (role === 'student') return 'Student';
  if (role === 'teacher') return 'Teacher';
  if (role === 'admin') return 'Admin';
  if (role === 'system_admin') return 'SystemAdmin';
  return null;
}

/**
 * ================================
 * CREATE BOOKING (ต้องล็อกอิน)
 * ================================
 * นักเรียน / ครู → จองห้องได้
 * admin / system_admin → ก็จองได้เช่นกัน
 */
router.post('/', auth, async (req, res) => {
  try {
    const { room_id, purpose, booking_date, start_time, end_time } = req.body;

    // ตรวจสอบว่ามีข้อมูลจำเป็นครบหรือยัง
    if (!room_id || !booking_date || !start_time || !end_time) {
      return res.status(400).json({
        message: 'room_id, booking_date, start_time, end_time required'
      });
    }

    // ตรวจสอบว่าห้องมีอยู่จริง
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // ห้องสถานะ maintenance → ห้ามจอง
    if (room.status === 'maintenance') {
      return res.status(400).json({ message: 'Room under maintenance' });
    }

    /**
     * เตรียมวันที่แบบ normalized (ตั้งเวลาเป็น 00:00:00)
     * เพื่อใช้ในการค้นหา booking เฉพาะวันเดียวกัน
     */
    const dateOnly = new Date(booking_date);
    dateOnly.setHours(0, 0, 0, 0);

    const nextDay = new Date(dateOnly);
    nextDay.setDate(nextDay.getDate() + 1);

    /**
     * ค้นหา Booking ที่:
     * – ห้องเดียวกัน
     * – วันที่เดียวกัน
     * – สถานะ pending หรือ approved (rejected/cancelled ไม่ต้องสน)
     */
    const existing = await Booking.find({
      room_id,
      booking_date: { $gte: dateOnly, $lt: nextDay },
      status: { $in: ['pending', 'approved'] }
    });

    // เช็คเวลา overlap
    for (const b of existing) {
      if (isOverlap(b.start_time, b.end_time, start_time, end_time)) {
        return res.status(409).json({
          message: 'Time conflict with another booking',
          conflict: b
        });
      }
    }

    // สร้าง booking ใหม่
    const booking = await Booking.create({
      user_id: req.user.id,
      userModel: roleToModelName(req.user.role),
      room_id,
      purpose,
      booking_date: dateOnly,
      start_time,
      end_time,
      status: 'pending'
    });

    return res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * ================================
 * GET BOOKINGS (ดึงข้อมูลการจอง)
 * ================================
 * รองรับ filter:
 * - room_id
 * - date
 * - user_id
 */
router.get('/', auth, async (req, res) => {
  try {
    const { room_id, date, user_id } = req.query;

    const filter = {};

    if (room_id) filter.room_id = room_id;
    if (user_id) filter.user_id = user_id;

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const d2 = new Date(d);
      d2.setDate(d2.getDate() + 1);

      filter.booking_date = { $gte: d, $lt: d2 };
    }

    // populate ห้อง + ผู้อนุมัติ
    const docs = await Booking.find(filter)
      .populate('room_id')
      .populate('approved_by')
      .lean();

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ================================
 * APPROVE BOOKING (เฉพาะ admin)
 * ================================
 */
router.put('/:id/approve', auth, async (req, res) => {
  try {
    // ตรวจสิทธิ์
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'approved') {
      return res.status(400).json({ message: 'Already approved' });
    }

    // double-check race condition
    const dateOnly = new Date(booking.booking_date);
    dateOnly.setHours(0, 0, 0, 0);

    const nextDay = new Date(dateOnly);
    nextDay.setDate(nextDay.getDate() + 1);

    const existing = await Booking.find({
      room_id: booking.room_id,
      _id: { $ne: booking._id },
      booking_date: { $gte: dateOnly, $lt: nextDay },
      status: { $in: ['approved'] }
    });

    for (const b of existing) {
      if (isOverlap(b.start_time, b.end_time, booking.start_time, booking.end_time)) {
        return res.status(409).json({
          message: 'Time conflict with existing approved booking',
          conflict: b
        });
      }
    }

    booking.status = 'approved';
    booking.approved_by = req.user.id;
    await booking.save();

    res.json({ message: 'Booking approved', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ================================
 * REJECT BOOKING (เฉพาะ admin)
 * ================================
 */
router.put('/:id/reject', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'rejected';
    booking.approved_by = req.user.id;
    await booking.save();

    res.json({ message: 'Booking rejected', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ================================
 * CANCEL BOOKING
 * ================================
 * ผู้สร้าง booking → ยกเลิกได้
 * admin/system_admin → ยกเลิกได้ทุก booking
 */
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    // ตรวจสิทธิ์
    if (
      booking.user_id.toString() !== req.user.id &&
      !['admin', 'system_admin'].includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
