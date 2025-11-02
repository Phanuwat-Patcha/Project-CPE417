const express = require('express');
const Admin = require('../models/Admin');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') return res.status(403).json({ message: 'Forbidden' });
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
