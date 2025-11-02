const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userModel' },
  userModel: { type: String, required: true, enum: ['Student', 'Teacher', 'Admin', 'SystemAdmin'] },
  room_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' },
  purpose: String,
  booking_date: { type: Date, required: true }, // date only (time part ignored)
  start_time: { type: String, required: true }, // "HH:MM"
  end_time: { type: String, required: true },   // "HH:MM"
  status: { type: String, default: 'pending' }, // pending / approved / rejected / cancelled
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
