const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(authMiddleware.verifyToken);

// Get Profile
router.get('/profile', userController.getProfile);

// Update Profile
router.put('/profile', userController.updateProfile);



module.exports = router;
