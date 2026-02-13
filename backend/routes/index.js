const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);

// Example of a protected route using placeholder middleware (uncomment when imported)
// router.get('/protected', verifyToken, (req, res) => res.json({ msg: 'Protected' }));

module.exports = router;
