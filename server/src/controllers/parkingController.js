import ParkingSpot from '../models/ParkingSpot.js';
import ParkingBooking from '../models/ParkingBooking.js';
import * as gamificationService from '../services/gamificationService.js';

// @desc    Get all parking spots (with optional filters)
// @route   GET /api/parking/spots
// @access  Protected
export const getAllSpots = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';

    const spots = await ParkingSpot.find(filter).sort({ createdAt: -1 });
    res.json({ count: spots.length, spots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby parking spots (geospatial)
// @route   GET /api/parking/nearby?lat=&lng=&radius=
// @access  Protected
export const getNearbySpots = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng query params are required' });
    }

    const spots = await ParkingSpot.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)], // [longitude, latitude]!
          },
          $maxDistance: parseInt(radius),
        },
      },
      isActive: true,
      availableSpots: { $gt: 0 },
    }).limit(20);

    res.json({ count: spots.length, spots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a specific parking spot
// @route   GET /api/parking/spots/:id
// @access  Protected
export const getSpotById = async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }
    res.json({ spot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a parking booking
// @route   POST /api/parking/book
// @access  Protected
export const createBooking = async (req, res) => {
  try {
    const { spotId, checkIn, checkOut, vehicleNumber } = req.body;
    const userId = req.user._id;

    if (!spotId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'spotId, checkIn, and checkOut are required' });
    }

    // Find the spot
    const spot = await ParkingSpot.findById(spotId);
    if (!spot) return res.status(404).json({ message: 'Parking spot not found' });
    if (!spot.isActive) return res.status(400).json({ message: 'This parking spot is not active' });
    if (spot.availableSpots <= 0) {
      return res.status(400).json({ message: 'No spots available' });
    }

    // Calculate cost
    const hours = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);
    if (hours <= 0) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }
    const totalCost = Math.ceil(hours) * spot.pricePerHour;

    // Create booking
    const booking = await ParkingBooking.create({
      user: userId,
      spot: spotId,
      checkIn,
      checkOut,
      totalCost,
      vehicleNumber,
      status: 'confirmed',
    });

    // Atomically decrement available spots
    await ParkingSpot.findByIdAndUpdate(spotId, {
      $inc: { availableSpots: -1 },
    });

    // Award gems
    await gamificationService.awardGems(userId, 10, 'parking_booking');

    // Populate spot details in response
    const populatedBooking = await ParkingBooking.findById(booking._id).populate('spot', 'name address pricePerHour');

    res.status(201).json({ booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's booking history
// @route   GET /api/parking/bookings
// @access  Protected
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await ParkingBooking.find({ user: req.user._id })
      .populate('spot', 'name address pricePerHour')
      .sort({ createdAt: -1 });

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/parking/bookings/:id
// @access  Protected
export const cancelBooking = async (req, res) => {
  try {
    const booking = await ParkingBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure the user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }

    // Cancel and restore spot availability
    booking.status = 'cancelled';
    await booking.save();

    await ParkingSpot.findByIdAndUpdate(booking.spot, {
      $inc: { availableSpots: 1 },
    });

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
