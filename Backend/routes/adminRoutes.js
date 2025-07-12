const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin access middleware (optional)
const requireAdmin = require('../middleware/adminMiddleware');

// User management
router.get('/users', requireAdmin, adminController.getUsers);
router.put('/users/:userId/ban', requireAdmin, adminController.banUser);
router.put('/users/:userId/unban', requireAdmin, adminController.unbanUser);

// Swap monitoring
router.get('/swaps', requireAdmin, adminController.getAllSwaps);

// Analytics
router.get('/analytics', requireAdmin, adminController.getAnalytics);

// Export
router.get('/export', requireAdmin, adminController.exportStats);

module.exports = router;
