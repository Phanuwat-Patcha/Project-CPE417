const mongoose = require('mongoose');

const sysAdminSchema = new mongoose.Schema({
  sysadmin_name: { type: String, required: true },
  sysadmin_email: { type: String, required: true, unique: true },
  sysadmin_phone: String,
  password: { type: String, required: true },
  role: { type: String, default: 'system_admin' }
}, { timestamps: true });

module.exports = mongoose.model('SystemAdmin', sysAdminSchema);
