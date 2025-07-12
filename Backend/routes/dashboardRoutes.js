const express = require("express");
const router = express.Router();
const { getMySwaps, getMyFeedback } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my-swaps", protect, getMySwaps);
router.get("/my-feedback", protect, getMyFeedback);

module.exports = router;
