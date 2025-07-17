import Colleague from '../models/Colleague.js';

const getDashboardStats = async (_req, res) => {
  try {
    console.log('🔍 Fetching dashboard stats...');

    const totalColleagues = await Colleague.countDocuments();
    console.log('✅ totalColleagues:', totalColleagues);

    const billingStats = await Colleague.aggregate([
      {
        $group: {
          _id: '$billingStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('✅ billingStats:', billingStats);

    const availabilityStats = await Colleague.aggregate([
      {
        $group: {
          _id: '$availability.status',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('✅ availabilityStats:', availabilityStats);

    const unbilledStats = await Colleague.aggregate([
      { $match: { billingStatus: 'UNBILLED' } },
      {
        $group: {
          _id: '$availability.status',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('✅ unbilledStats:', unbilledStats);

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
    console.log('✅ skillsStats:', skillsStats);

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
    console.log('✅ experienceStats:', experienceStats);

    res.json({
      totalColleagues,
      billingStats,
      availabilityStats,
      unbilledStats,
      skillsStats,
      experienceStats
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getDashboardStats };
