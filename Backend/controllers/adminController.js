const User = require('../models/UserModel');
const SwapRequest = require('../models/SwapRequestModel');

// Get all non-admin users (for User Management)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Ban a user
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { isBanned: true });
    res.json({ message: 'User banned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
};

// Unban a user
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { isBanned: false });
    res.json({ message: 'User unbanned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unban user' });
  }
};

// Get all swaps (for monitoring)
exports.getAllSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({})
      .populate('fromUserId', 'name profileImage location')
      .populate('toUserId', 'name profileImage location')
      .sort({ createdAt: -1 });
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
};

// Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeSwaps = await SwapRequest.countDocuments({ status: 'accepted' });
    const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
    const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });
    const avgRating = await User.aggregate([
      { $match: { role: 'user', rating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    res.json({
      totalUsers,
      activeSwaps,
      pendingSwaps,
      completedSwaps,
      avgRating: avgRating[0]?.avgRating?.toFixed(2) || "N/A"
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Download stats (export as JSON)
exports.exportStats = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    const swaps = await SwapRequest.find({});
    const exportDate = new Date().toISOString();

    const data = {
      users: users.length,
      swaps: swaps.length,
      exportDate,
    };

    res.setHeader('Content-Disposition', 'attachment; filename=skillswap-stats.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    res.status(500).json({ error: 'Failed to export stats' });
  }
};
