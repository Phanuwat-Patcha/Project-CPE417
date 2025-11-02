const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  student_email: { type: String, required: true, unique: true },
  student_phone: String,
  department: String,
  year: Number,
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
