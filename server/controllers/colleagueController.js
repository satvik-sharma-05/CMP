import Colleague from '../models/Colleague.js';
import { Parser } from 'json2csv';

const getAllColleagues = async (req, res) => {
  try {
    const { search, skill, availability, billing, sortBy, sortOrder } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (skill) query.skills = { $in: [skill] };
    if (availability) query['availability.status'] = availability;
    if (billing) query.billingStatus = billing;

    let colleaguesQuery = Colleague.find(query).populate('managerId', 'name email');

    // Sorting
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      colleaguesQuery = colleaguesQuery.sort({ [sortBy]: order });
    }

    const colleagues = await colleaguesQuery;

    res.json(colleagues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getColleagueById = async (req, res) => {
  try {
    const colleague = await Colleague.findById(req.params.id).populate('managerId', 'name email');

    if (!colleague) {
      return res.status(404).json({ message: 'Colleague not found' });
    }

    res.json(colleague);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createColleague = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // 👈 Add this

    const colleague = await Colleague.create(req.body);
    await colleague.populate('managerId', 'name email');

    res.status(201).json(colleague);
  } catch (error) {
    console.error("Create Colleague Error:", error); // 👈 Add this
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};



// controllers/colleagueController.js
const updateColleague = async (req, res) => {
  try {
    const updated = await Colleague.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Colleague not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};



const deleteColleague = async (req, res) => {
  try {
    const colleague = await Colleague.findByIdAndDelete(req.params.id);

    if (!colleague) {
      return res.status(404).json({ message: 'Colleague not found' });
    }

    res.json({ message: 'Colleague deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const exportColleaguesCSV = async (req, res) => {
  try {
    const colleagues = await Colleague.find().lean(); // no Mongoose doc
    const fields = [
      'firstName',
      'lastName',
      'email',
      'skills',
      'experienceInYears',
      'billingStatus',
      'availability.availableInDays',
      'availability.status',
      'assignment.name',
      'managerId.name'
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(colleagues);

    res.header('Content-Type', 'text/csv');
    res.attachment('colleagues.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Failed to export CSV' });
  }
};
// Get billing status summary
const billingSummary = async (req, res) => {
  try {
    const summary = await Colleague.aggregate([
      { $group: { _id: "$billingStatus", count: { $sum: 1 } } }
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch billing summary', error: error.message });
  }
};

// Get availability status summary
const availabilitySummary = async (req, res) => {
  try {
    const summary = await Colleague.aggregate([
      { $group: { _id: "$availability.status", count: { $sum: 1 } } }
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability summary', error: error.message });
  }
};

export {
  getAllColleagues,
  getColleagueById,
  createColleague,
  updateColleague,
  billingSummary,
  availabilitySummary,
  deleteColleague,
  exportColleaguesCSV
};

