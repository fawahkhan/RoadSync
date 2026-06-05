import User from '../models/User.js';

const GEM_ACTIONS = {
  parking_booking: 10,
  emission_calculated: 20,
  low_emission_trip: 50,
  crime_reported: 15,
  daily_login: 5,
  chat_interaction: 2,
};

const BADGE_THRESHOLDS = [
  { name: 'First Steps', gemsRequired: 0, icon: '🌟', description: 'Welcome to RoadSync!' },
  { name: 'Green Driver', gemsRequired: 100, icon: '🌿', description: 'Earned 100 gems' },
  { name: 'Eco Champion', gemsRequired: 500, icon: '🏆', description: 'Earned 500 gems' },
  { name: 'City Guardian', gemsRequired: 1000, icon: '🛡️', description: 'Earned 1000 gems' },
  { name: 'Road Master', gemsRequired: 2500, icon: '👑', description: 'Earned 2500 gems' },
];

/**
 * Award gems to a user for an action and check for new badges
 * @param {string} userId - The user's MongoDB ID
 * @param {number} amount - Number of gems to award
 * @param {string} reason - The action that earned the gems
 * @returns {Object} { updatedGems, newBadges }
 */
export const awardGems = async (userId, amount, reason) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { gems: amount } },
    { new: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  // Check and award any new badges
  const newBadges = await checkAndAwardBadges(user);

  return { updatedGems: user.gems, newBadges };
};

/**
 * Check gem thresholds and award any earned badges
 */
const checkAndAwardBadges = async (user) => {
  const newBadges = [];

  for (const badge of BADGE_THRESHOLDS) {
    const alreadyHas = user.badges.some(b => b.name === badge.name);
    if (!alreadyHas && user.gems >= badge.gemsRequired) {
      await User.findByIdAndUpdate(user._id, {
        $push: {
          badges: {
            name: badge.name,
            icon: badge.icon,
            earnedAt: new Date(),
          },
        },
      });
      newBadges.push(badge);
    }
  }

  return newBadges;
};

export { GEM_ACTIONS, BADGE_THRESHOLDS };
