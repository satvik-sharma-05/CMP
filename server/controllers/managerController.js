import Manager from '../models/Manager.js';

export const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find({}, '_id username');
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch managers', error: error.message });
  }
};
