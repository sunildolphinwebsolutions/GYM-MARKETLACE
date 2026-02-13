const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a payment transaction
router.post('/transaction', paymentController.createTransaction);

// Verify a transaction
router.get('/verify/:transaction_id', paymentController.verifyTransaction);

// Get all payments (Admin)
router.get('/', paymentController.getAllPayments);

module.exports = router;
