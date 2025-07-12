const SwapRequest = require("../models/SwapRequest");
const Feedback = require("../models/Feedback");

// Get all swap requests for current user (as sender or recipient)
const getMySwaps = async (req, res) => {
  try {
    const userId = req.user.id;

    const swaps = await SwapRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    })
      .populate("fromUserId", "name profileImage")
      .populate("toUserId", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(swaps);
  } catch (err) {
    console.error("Get Swaps Error:", err);
    res.status(500).json({ error: "Failed to fetch swaps" });
  }
};

// Get all feedback received by current user
const getMyFeedback = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedbacks = await Feedback.find({ toUserId: userId })
      .populate("fromUserId", "name profileImage")
      .populate("swapId", "skillOffered skillWanted")
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("Get Feedback Error:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

module.exports = {
  getMySwaps,
  getMyFeedback,
};
