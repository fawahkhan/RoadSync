import mongoose from 'mongoose';

const crimeReportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporterName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['accident', 'theft', 'assault', 'traffic_violation', 'emergency', 'other'],
    required: [true, 'Report type is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  incidentDate: {
    type: Date,
    required: true,
  },
  incidentTime: String,
  attachments: [String], // Array of file URLs (Cloudinary in production)
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'resolved', 'dismissed'],
    default: 'submitted',
  },
}, {
  timestamps: true,
});

// Index for user's reports and status filtering
crimeReportSchema.index({ reportedBy: 1, createdAt: -1 });
crimeReportSchema.index({ status: 1 });

const CrimeReport = mongoose.model('CrimeReport', crimeReportSchema);
export default CrimeReport;
