const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const SystemAdmin = require('../models/SystemAdmin');

const router = express.Router();
const SALT_ROUNDS = 10;

// Register (generic) - role: student|teacher|admin|system_admin
router.post('/register', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'role is required' });

    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    let created;
    if (role === 'student') {
      created = await Student.create({
        student_name: req.body.name,
        student_email: req.body.email,
        student_phone: req.body.phone,
        department: req.body.department,
        year: req.body.year,
        password: passwordHash
      });
    } else if (role === 'teacher') {
      created = await Teacher.create({
        teacher_name: req.body.name,
        teacher_email: req.body.email,
        teacher_phone: req.body.phone,
        department: req.body.department,
        password: passwordHash
      });
    } else if (role === 'admin') {
      created = await Admin.create({
        admin_name: req.body.name,
        admin_email: req.body.email,
        admin_phone: req.body.phone,
        position: req.body.position,
        password: passwordHash
      });
    } else if (role === 'system_admin') {
      created = await SystemAdmin.create({
        sysadmin_name: req.body.name,
        sysadmin_email: req.body.email,
        sysadmin_phone: req.body.phone,
        password: passwordHash
      });
    } else {
      return res.status(400).json({ message: 'invalid role' });
    }

    return res.status(201).json({ message: 'User created', id: created._id });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    return res.status(500).json({ message: err.message });
  }
});

// Login: body { email, password, role }
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'email, password, role required' });

    let user;
    if (role === 'student') user = await Student.findOne({ student_email: email });
    else if (role === 'teacher') user = await Teacher.findOne({ teacher_email: email });
    else if (role === 'admin') user = await Admin.findOne({ admin_email: email });
    else if (role === 'system_admin') user = await SystemAdmin.findOne({ sysadmin_email: email });
    else return res.status(400).json({ message: 'Invalid role' });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    // create token payload
    const payload = {
      id: user._id,
      role,
      email
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return res.json({ token, role, id: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
