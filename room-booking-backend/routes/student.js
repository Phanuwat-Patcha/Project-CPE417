const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// GET all students
router.get('/', auth, async (req, res) => {
  try {
    // อนุญาตให้ admin หรือ system_admin เท่านั้น (ตัวอย่าง)
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

module.exports = router;
