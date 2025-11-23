// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const SystemAdmin = require('../models/SystemAdmin');

const router = express.Router();
const SALT_ROUNDS = 10; // จำนวนรอบการ hash ของ bcrypt

/**
 * ============================
 * REGISTER ผู้ใช้ (นักเรียน, ครู, admin, system_admin)
 * ============================
 * body:
 * {
 *   "role": "student|teacher|admin|system_admin",
 *   "name": "...",
 *   "email": "...",
 *   "phone": "...",
 *   // สำหรับ student/teacher: department, year
 *   // สำหรับ admin: position
 *   "password": "..."
 * }
 */
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, phone, password } = req.body;
    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: 'role, name, email, password required' });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    let created;

    // สร้าง user ตาม role
    if (role === 'student') {
      created = await Student.create({
        student_name: name,
        student_email: email,
        student_phone: phone,
        department: req.body.department || '',
        year: req.body.year || '',
        password: passwordHash
      });
    } else if (role === 'teacher') {
      created = await Teacher.create({
        teacher_name: name,
        teacher_email: email,
        teacher_phone: phone,
        department: req.body.department || '',
        password: passwordHash
      });
    } else if (role === 'admin') {
      created = await Admin.create({
        admin_name: name,
        admin_email: email,
        admin_phone: phone,
        position: req.body.position || '',
        password: passwordHash
      });
    } else if (role === 'system_admin') {
      created = await SystemAdmin.create({
        sysadmin_name: name,
        sysadmin_email: email,
        sysadmin_phone: phone,
        password: passwordHash
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    return res.status(201).json({ message: 'User created', id: created._id });
  } catch (err) {
    console.error(err);
    // ตรวจสอบ duplicate email
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: err.message });
  }
});

/**
 * ============================
 * LOGIN ผู้ใช้
 * ============================
 * body:
 * {
 *   "email": "...",
 *   "password": "...",
 *   "role": "student|teacher|admin|system_admin"
 * }
 *
 * response:
 * {
 *   "token": "...",
 *   "role": "...",
 *   "id": "..."
 * }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password, role required' });
    }

    let user;

    // หา user ตาม role
    if (role === 'student') user = await Student.findOne({ student_email: email });
    else if (role === 'teacher') user = await Teacher.findOne({ teacher_email: email });
    else if (role === 'admin') user = await Admin.findOne({ admin_email: email });
    else if (role === 'system_admin') user = await SystemAdmin.findOne({ sysadmin_email: email });
    else return res.status(400).json({ message: 'Invalid role' });

    if (!user) return res.status(400).json({ message: 'User not found' });

    // ตรวจสอบรหัสผ่าน
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    // สร้าง JWT token
    const payload = { id: user._id, role, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return res.json({ token, role, id: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
