const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET room by id
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE room (ต้องเป็น admin)
router.post('/', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    const { room_name, building, floor, equipment, status } = req.body;
    const room = await Room.create({ room_name, building, floor, equipment, status });
    res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE room (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Updated', room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE room (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'system_admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
