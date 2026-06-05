import mongoose from 'mongoose';

const parkingSpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parking spot name is required'],
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude] — GeoJSON format (lng first!)
      required: [true, 'Coordinates are required'],
    },
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  totalSpots: {
    type: Number,
    required: [true, 'Total spots count is required'],
    min: [1, 'Must have at least 1 spot'],
  },
  availableSpots: {
    type: Number,
    required: [true, 'Available spots count is required'],
    min: [0, 'Available spots cannot be negative'],
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [0, 'Price cannot be negative'],
  },
  amenities: [{
    type: String,
    enum: ['covered', 'ev_charging', 'security', 'cctv', 'wheelchair_accessible', 'valet'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// 2dsphere index for geospatial queries (find nearby spots)
parkingSpotSchema.index({ location: '2dsphere' });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
export default ParkingSpot;
