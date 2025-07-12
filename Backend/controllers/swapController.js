const User = require('../models/UserModel');
const SwapRequest = require("../models/SwapRequestModel");

const createSwapRequest = async (req, res) => {
  try {
    const { fromUserId, toUserId, skillOffered, skillWanted, message } = req.body;

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "Cannot request swap with yourself" });
    }

    const swap = new SwapRequest({
      fromUserId,
      toUserId,
      skillOffered,
      skillWanted,
      message,
      status: "pending",
    });

    await swap.save();

    res.status(201).json({ message: "Swap request sent successfully", swap });
  } catch (err) {
    console.error("Create Swap Request Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// GET /api/swaps - Get all swaps related to the logged-in user
exports.getSwaps = async (req, res) => {
  try {
    const userId = req.user._id;

    const swaps = await SwapRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    })
    .populate('fromUserId', 'name location profileImage rating')
    .populate('toUserId', 'name location profileImage rating')
    .sort({ updatedAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
};

// PUT /api/swaps/:id/accept
exports.acceptSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await SwapRequest.findById(id);
    if (!swap || swap.toUserId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized or not found' });
    }

    swap.status = 'accepted';
    await swap.save();

    res.json({ message: 'Swap accepted', swap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept swap' });
  }
};

// PUT /api/swaps/:id/reject-or-cancel
exports.rejectOrCancelSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await SwapRequest.findById(id);
    if (!swap) return res.status(404).json({ error: 'Swap not found' });

    if (swap.toUserId.toString() === userId.toString()) {
      swap.status = 'rejected';
    } else if (swap.fromUserId.toString() === userId.toString()) {
      swap.status = 'rejected'; // treating cancel as rejection
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await swap.save();
    res.json({ message: 'Swap updated', swap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update swap' });
  }
};

// PUT /api/swaps/:id/complete
exports.completeSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await SwapRequest.findById(id);
    if (!swap || !['accepted'].includes(swap.status)) {
      return res.status(400).json({ error: 'Swap not in accepted state' });
    }

    if (
      swap.fromUserId.toString() !== userId.toString() &&
      swap.toUserId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    swap.status = 'completed';
    await swap.save();

    // Update partner's stats
    const partnerId = swap.fromUserId.toString() === userId.toString()
      ? swap.toUserId
      : swap.fromUserId;

    const partner = await User.findById(partnerId);
    if (partner) {
      partner.totalSwaps = (partner.totalSwaps || 0) + 1;
      await partner.save();
    }

    res.json({ message: 'Swap marked as completed', swap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete swap' });
  }
};

// PUT /api/swaps/:id/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const userId = req.user._id;
    const swap = await SwapRequest.findById(id);

    if (!swap || swap.status !== 'completed') {
      return res.status(400).json({ error: 'Swap must be completed first' });
    }

    const partnerId = swap.fromUserId.toString() === userId.toString()
      ? swap.toUserId
      : swap.fromUserId;

    const partner = await User.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    // Update rating
    const newTotal = partner.totalSwaps + 1;
    partner.rating = ((partner.rating * partner.totalSwaps) + rating) / newTotal;
    partner.totalSwaps = newTotal;

    await partner.save();
    res.json({ message: 'Feedback submitted', rating: partner.rating.toFixed(1) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
