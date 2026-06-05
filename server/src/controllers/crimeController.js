import CrimeReport from '../models/CrimeReport.js';
import * as gamificationService from '../services/gamificationService.js';

// @desc    Submit a crime/emergency report
// @route   POST /api/crimes/report
// @access  Protected
export const submitReport = async (req, res) => {
  try {
    const { type, description, location, incidentDate, incidentTime } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!type || !description || !location) {
      return res.status(400).json({
        message: 'Type, description, and location are required',
      });
    }

    // Handle file attachments (from multer)
    const attachments = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const report = await CrimeReport.create({
      reportedBy: userId,
      reporterName: req.user.name,
      type,
      description,
      location: {
        address: typeof location === 'string' ? location : location.address,
        coordinates: location.coordinates || [],
      },
      incidentDate: incidentDate || new Date(),
      incidentTime,
      attachments,
    });

    // Award gems for reporting
    await gamificationService.awardGems(userId, 15, 'crime_reported');

    res.status(201).json({
      message: 'Report submitted successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own reports
// @route   GET /api/crimes/my-reports
// @access  Protected
export const getMyReports = async (req, res) => {
  try {
    const reports = await CrimeReport.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (admin)
// @route   GET /api/crimes/all
// @access  Protected + Admin
export const getAllReports = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const reports = await CrimeReport.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status (admin)
// @route   PUT /api/crimes/:id/status
// @access  Protected + Admin
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['submitted', 'under_review', 'resolved', 'dismissed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const report = await CrimeReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Status updated', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
