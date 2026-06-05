import EmissionRecord from '../models/EmissionRecord.js';
import * as emissionService from '../services/emissionService.js';
import * as gamificationService from '../services/gamificationService.js';

// @desc    Calculate CO2 emission and save record
// @route   POST /api/emissions/calculate
// @access  Protected
export const calculateEmission = async (req, res) => {
  try {
    const { vehicle, trip } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!vehicle || !trip) {
      return res.status(400).json({ message: 'Vehicle and trip data are required' });
    }
    if (!vehicle.fuelType || !vehicle.mileage || !trip.distanceKm) {
      return res.status(400).json({
        message: 'fuelType, mileage, and distanceKm are required',
      });
    }

    // 1. Calculate CO2
    const { co2Grams, fuelConsumedLitres } = emissionService.calculate(vehicle, trip);

    // 2. Calculate percentile (what % of users emit more than this?)
    const totalCount = await EmissionRecord.countDocuments();
    let percentile = 50;
    if (totalCount > 0) {
      const higherCount = await EmissionRecord.countDocuments({ co2Grams: { $gt: co2Grams } });
      percentile = Math.round((higherCount / totalCount) * 100);
    }

    // 3. Award gems based on emission level
    const gemsEarned = emissionService.calculateGems(co2Grams);

    // 4. Save the record
    const record = await EmissionRecord.create({
      user: userId,
      vehicle: {
        company: vehicle.company,
        model: vehicle.model,
        fuelType: vehicle.fuelType,
        engineCC: vehicle.engineCC,
        cylinders: vehicle.cylinders,
        mileage: vehicle.mileage,
      },
      trip: {
        distanceKm: trip.distanceKm,
        fuelConsumedLitres,
      },
      co2Grams,
      percentile,
      gemsEarned,
    });

    // 5. Award gems to user
    await gamificationService.awardGems(userId, gemsEarned, 'emission_calculated');

    res.status(201).json({
      record,
      co2Grams,
      percentile,
      gemsEarned,
      fuelConsumedLitres,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's emission history
// @route   GET /api/emissions/history
// @access  Protected
export const getHistory = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const records = await EmissionRecord.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EmissionRecord.countDocuments({ user: req.user._id });

    res.json({
      records,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly emission summary for dashboard chart
// @route   GET /api/emissions/summary
// @access  Protected
export const getMonthlySummary = async (req, res) => {
  try {
    const summary = await EmissionRecord.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalCO2: { $sum: '$co2Grams' },
          avgCO2: { $avg: '$co2Grams' },
          count: { $sum: 1 },
          totalGems: { $sum: '$gemsEarned' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format for chart consumption
    const monthly = summary.map(item => ({
      year: item._id.year,
      month: item._id.month,
      label: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      totalCO2: Math.round(item.totalCO2),
      avgCO2: Math.round(item.avgCO2),
      trips: item.count,
      gemsEarned: item.totalGems,
    }));

    // Overall stats
    const totalRecords = await EmissionRecord.countDocuments({ user: req.user._id });
    const overallAvg = totalRecords > 0
      ? await EmissionRecord.aggregate([
          { $match: { user: req.user._id } },
          { $group: { _id: null, avg: { $avg: '$co2Grams' }, total: { $sum: '$co2Grams' } } },
        ])
      : [{ avg: 0, total: 0 }];

    res.json({
      monthly,
      stats: {
        totalTrips: totalRecords,
        totalCO2: Math.round(overallAvg[0]?.total || 0),
        avgCO2PerTrip: Math.round(overallAvg[0]?.avg || 0),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
