const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// Protected Routes (Gym Owners Only)
router.post('/', authMiddleware.verifyToken, authMiddleware.isGymOwner, upload.array('images', 5), gymController.createGym);
router.get('/my-gyms', authMiddleware.verifyToken, authMiddleware.isGymOwner, gymController.getOwnerGyms);
router.get('/stats', authMiddleware.verifyToken, authMiddleware.isGymOwner, gymController.getOwnerStats);
router.get('/dashboard-stats', authMiddleware.verifyToken, authMiddleware.isGymOwner, gymController.getOwnerDashboardStats);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isGymOwner, upload.array('images', 5), gymController.updateGym);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isGymOwner, gymController.deleteGym);

// Public Routes
router.get('/', gymController.getAllGyms);
router.get('/:id', gymController.getGymById);

module.exports = router;
