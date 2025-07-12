const express = require("express");
const router = express.Router();
const {createSwapRequest,swapController} = require("../controllers/swapController");
const {protect} = require('../middleware/authMiddleware');

router.post("/create-swap-request", protect, createSwapRequest); 
// All routes require auth
router.use(protect);

router.get('/', swapController.getSwaps);
router.put('/:id/accept', swapController.acceptSwap);
router.put('/:id/reject-or-cancel', swapController.rejectOrCancelSwap);
router.put('/:id/complete', swapController.completeSwap);
router.put('/:id/feedback', swapController.submitFeedback);

module.exports = router;



















module.exports = router;
