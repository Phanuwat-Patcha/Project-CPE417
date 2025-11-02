const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacher_name: { type: String, required: true },
  teacher_email: { type: String, required: true, unique: true },
  teacher_phone: String,
  department: String,
  password: { type: String, required: true },
  role: { type: String, default: 'teacher' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
