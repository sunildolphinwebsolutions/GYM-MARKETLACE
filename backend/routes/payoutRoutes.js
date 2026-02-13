const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Get stats for Gym Owner
router.get('/stats', verifyToken, checkRole(['gym_owner']), payoutController.getPayoutStats);

// Get payout history
router.get('/list', verifyToken, checkRole(['gym_owner']), payoutController.getPayoutHistory);

// Request a payout
router.post('/request', verifyToken, checkRole(['gym_owner']), payoutController.requestPayout);

// Admin: Get all payouts
router.get('/all', verifyToken, checkRole(['admin']), payoutController.getAllPayouts);

// Admin: Update payout status
router.put('/:id/status', verifyToken, checkRole(['admin']), payoutController.updatePayoutStatus);

module.exports = router;
