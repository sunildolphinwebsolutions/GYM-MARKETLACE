
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all admin routes
// router.use(authMiddleware.verifyToken, authMiddleware.checkRole(['admin']));
// For development simplicity, let's just use verifyToken for now, or checkRole if user is logged in as admin.
// Assuming the user will login as admin.

router.get('/stats', authMiddleware.verifyToken, authMiddleware.checkRole(['admin']), adminController.getDashboardStats);
router.get('/sellers', authMiddleware.verifyToken, authMiddleware.checkRole(['admin']), adminController.getSellers);
router.get('/gyms/pending', authMiddleware.verifyToken, authMiddleware.checkRole(['admin']), adminController.getPendingGyms);
router.put('/gyms/:id/approve', authMiddleware.verifyToken, authMiddleware.checkRole(['admin']), adminController.approveGym);
router.put('/gyms/:id/reject', authMiddleware.verifyToken, authMiddleware.checkRole(['admin']), adminController.rejectGym);
router.get('/commissions', authMiddleware.verifyToken, authMiddleware.checkRole(['admin']), adminController.getCommissions);
router.get('/transactions', authMiddleware.verifyToken, authMiddleware.checkRole(['admin']), adminController.getTransactions);

module.exports = router;
