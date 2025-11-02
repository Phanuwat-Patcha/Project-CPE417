const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  admin_name: { type: String, required: true },
  admin_email: { type: String, required: true, unique: true },
  admin_phone: String,
  position: String,
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
