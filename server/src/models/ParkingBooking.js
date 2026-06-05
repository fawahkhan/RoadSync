import mongoose from 'mongoose';

const parkingBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpot',
    required: true,
  },
  vehicleNumber: {
    type: String,
    trim: true,
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in time is required'],
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out time is required'],
  },
  totalCost: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Index for fast lookups of a user's bookings
parkingBookingSchema.index({ user: 1, createdAt: -1 });

const ParkingBooking = mongoose.model('ParkingBooking', parkingBookingSchema);
export default ParkingBooking;
