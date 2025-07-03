import express from 'express';
import {
  getAllColleagues,
  getColleagueById,
  createColleague,
  updateColleague,
  deleteColleague,
  exportColleaguesCSV
} from '../controllers/colleagueController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all routes

router.route('/')
  .get(getAllColleagues)
  .post(createColleague);

router.get('/export', exportColleaguesCSV); // ✅ ADD THIS

router.route('/:id')
  .get(getColleagueById)
  .put(updateColleague)
  .delete(deleteColleague);

export default router;