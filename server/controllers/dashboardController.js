import Colleague from '../models/Colleague.js';

const getDashboardStats = async (_req, res) => {
  try {
    // Total colleagues
    const totalColleagues = await Colleague.countDocuments();
    
    // Billing status breakdown
    const billingStats = await Colleague.aggregate([
      {
        $group: {
          _id: '$billingStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Availability breakdown
    const availabilityStats = await Colleague.aggregate([
      {
        $group: {
          _id: '$availability.status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Skills distribution
    const skillsStats = await Colleague.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Experience distribution
    const experienceStats = await Colleague.aggregate([
      {
        $bucket: {
          groupBy: '$experienceInYears',
          boundaries: [0, 2, 5, 10, 15, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    
    res.json({
      totalColleagues,
      billingStats,
      availabilityStats,
      skillsStats,
      experienceStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getDashboardStats };