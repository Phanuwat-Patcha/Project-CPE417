const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_name: { type: String, required: true },
  building: String,
  floor: Number,
  equipment: String,
  status: { type: String, default: 'available' } // available / maintenance
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
