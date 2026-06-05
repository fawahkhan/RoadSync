import mongoose from 'mongoose';

const emissionRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicle: {
    company: { type: String, required: true },
    model: { type: String, required: true },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'cng', 'electric', 'hybrid'],
      required: true,
    },
    engineCC: Number,
    cylinders: Number,
    mileage: Number, // km per litre
  },
  trip: {
    distanceKm: {
      type: Number,
      required: true,
      min: [0.1, 'Distance must be positive'],
    },
    fuelConsumedLitres: Number,
  },
  co2Grams: {
    type: Number,
    required: true,
  },
  percentile: Number,
  gemsEarned: {
    type: Number,
    default: 0,
  },
  aiAnalysis: String,
}, {
  timestamps: true,
});

// Index for fast user history + monthly aggregation
emissionRecordSchema.index({ user: 1, createdAt: -1 });

const EmissionRecord = mongoose.model('EmissionRecord', emissionRecordSchema);
export default EmissionRecord;
