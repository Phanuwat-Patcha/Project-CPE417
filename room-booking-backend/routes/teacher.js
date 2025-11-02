const express = require('express');
const Teacher = require('../models/Teacher');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
