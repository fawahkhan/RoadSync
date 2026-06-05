import User from '../models/User.js';

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Protected
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gems: user.gems,
        badges: user.badges,
        vehicleInfo: user.vehicleInfo,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Protected
export const updateProfile = async (req, res) => {
  try {
    const { name, vehicleInfo } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (vehicleInfo) updateData.vehicleInfo = vehicleInfo;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gems: user.gems,
        badges: user.badges,
        vehicleInfo: user.vehicleInfo,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard (top users by gems)
// @route   GET /api/users/leaderboard
// @access  Protected
export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const users = await User.find()
      .select('name gems badges')
      .sort({ gems: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      gems: user.gems,
      badgeCount: user.badges.length,
    }));

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
