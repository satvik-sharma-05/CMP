// routes/managers.js
import express from 'express';
import Manager from '../models/Manager.js';

const router = express.Router();

// 🔥 1. Create Manager
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields (username, email, password) are required' });
    }

    const manager = new Manager({ username, email, password });
    await manager.save();
    res.status(201).json(manager);
  } catch (err) {
    console.error('❌ Manager creation failed:', err);
    res.status(400).json({ message: 'Manager creation failed', error: err.message });
  }
});

// ✅ 2. Get All Managers
router.get('/', async (req, res) => {
  try {
    const managers = await Manager.find({}, '_id username email');
    res.status(200).json(managers); // ✅ Send array directly
  } catch (err) {
    console.error('❌ Manager fetch failed:', err);
    res.status(500).json({ message: 'Failed to fetch managers' });
  }
});

export default router;
