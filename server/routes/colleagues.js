import express from 'express';
import {
  getAllColleagues,
  getColleagueById,
  createColleague,
  updateColleague,
  deleteColleague,
  exportColleaguesCSV,
  billingSummary,
  availabilitySummary
} from '../controllers/colleagueController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all routes

router.route('/')
  .get(getAllColleagues)
  .post(createColleague);

router.get('/export', exportColleaguesCSV);

router.route('/:id')
  .get(getColleagueById)
  .put(updateColleague)
  .delete(deleteColleague);

router.get('/summary/billing', billingSummary);
router.get('/summary/availability', availabilitySummary);

export default router;