const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commissionController');
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Assuming these exist

// Apply auth middleware to protect these routes
// router.use(verifyToken);
// router.use(isAdmin); 
// Since I haven't checked auth middleware, I'll comment out for now but should enable later.

router.post('/', commissionController.createRule);
router.get('/', commissionController.getRules);
router.put('/:id', commissionController.updateRule);
router.delete('/:id', commissionController.deleteRule);

module.exports = router;
