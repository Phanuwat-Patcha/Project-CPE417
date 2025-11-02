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

// Helper to determine userModel from role
function roleToModelName(role) {
  if (role === 'student') return 'Student';
  if (role === 'teacher') return 'Teacher';
  if (role === 'admin') return 'Admin';
  if (role === 'system_admin') return 'SystemAdmin';
  return null;
}

// Create booking (login required)
router.post('/', auth, async (req, res) => {
  try {
    const { room_id, purpose, booking_date, start_time, end_time } = req.body;
    if (!room_id || !booking_date || !start_time || !end_time) {
      return res.status(400).json({ message: 'room_id, booking_date, start_time, end_time required' });
    }

    // validate room exists
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.status === 'maintenance') return res.status(400).json({ message: 'Room under maintenance' });

    // find existing bookings for same room and same date that are approved or pending
    const dateOnly = new Date(booking_date);
    dateOnly.setHours(0,0,0,0);
    const nextDay = new Date(dateOnly);
    nextDay.setDate(nextDay.getDate() + 1);

    const existing = await Booking.find({
      room_id,
      booking_date: { $gte: dateOnly, $lt: nextDay },
      status: { $in: ['pending', 'approved'] }
    });

    // check overlap
    for (const b of existing) {
      if (isOverlap(b.start_time, b.end_time, start_time, end_time)) {
        return res.status(409).json({ message: 'Time conflict with another booking', conflict: b });
      }
    }

    // create booking
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

// Get bookings (optionally filter by room/date/user)
router.get('/', auth, async (req, res) => {
  try {
    const { room_id, date, user_id } = req.query;
    const filter = {};

    if (room_id) filter.room_id = room_id;
    if (user_id) filter.user_id = user_id;
    if (date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      const d2 = new Date(d); d2.setDate(d2.getDate() + 1);
      filter.booking_date = { $gte: d, $lt: d2 };
    }

    const docs = await Booking.find(filter).populate('room_id').populate('approved_by').lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve booking (admin)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    if (!['admin','system_admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'approved') return res.status(400).json({ message: 'Already approved' });

    // Before approving, double-check no overlap with other approved bookings (race condition check)
    const dateOnly = new Date(booking.booking_date);
    dateOnly.setHours(0,0,0,0);
    const nextDay = new Date(dateOnly); nextDay.setDate(nextDay.getDate() + 1);

    const existing = await Booking.find({
      room_id: booking.room_id,
      _id: { $ne: booking._id },
      booking_date: { $gte: dateOnly, $lt: nextDay },
      status: { $in: ['approved'] }
    });

    for (const b of existing) {
      if (isOverlap(b.start_time, b.end_time, booking.start_time, booking.end_time)) {
        return res.status(409).json({ message: 'Time conflict with existing approved booking', conflict: b });
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

// Reject booking (admin)
router.put('/:id/reject', auth, async (req, res) => {
  try {
    if (!['admin','system_admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
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

// Cancel booking (user who created or admin)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    if (booking.user_id.toString() !== req.user.id && !['admin','system_admin'].includes(req.user.role)) {
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
