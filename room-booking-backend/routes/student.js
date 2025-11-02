const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware'); // ตรวจสอบ JWT
const router = express.Router();

// GET all students
router.get('/', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single student
router.get('/:id', auth, async (req, res) => {
  try {
    const stud = await Student.findById(req.params.id);
    if (!stud) return res.status(404).json({ message: 'Not found' });
    res.json(stud);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new student
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, studentId, email } = req.body;
    const student = new Student({ name, studentId, email });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update student
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE student
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
