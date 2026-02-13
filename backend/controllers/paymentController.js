const { FedaPay, Transaction } = require('fedapay');
const db = require('../db');
require('dotenv').config();

// Configure FedaPay
FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment(process.env.FEDAPAY_ENVIRONMENT || 'sandbox');

exports.createTransaction = async (req, res) => {
    try {
        const { amount, description, customer_email, customer_lastname, customer_firstname, callback_url } = req.body;

        const transaction = await Transaction.create({
            description: description,
            amount: amount,
            currency: { iso: 'XOF' },
            callback_url: callback_url,
            customer: {
                email: customer_email,
                lastname: customer_lastname,
                firstname: customer_firstname,
            }
        });

        const token = await transaction.generateToken();

        res.status(200).json({ payment_url: token.url, transaction_id: transaction.id });
    } catch (error) {
        console.error('FedaPay Transaction Error:', error);
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
};

exports.verifyTransaction = async (req, res) => {
    try {
        const { transaction_id } = req.params;
        const transaction = await Transaction.retrieve(transaction_id);

        if (transaction.status === 'approved') {
            // Check if this transaction is already processed in payments table
            const existingPayment = await db.query('SELECT * FROM payments WHERE transaction_id = $1', [transaction_id]);
            if (existingPayment.rows.length > 0) {
                return res.json({ status: transaction.status, transaction, message: 'Payment already processed' });
            }

            // We need to know which booking this is for. 
            // If the frontend calls this, it should pass booking_id in query or body.
            // If this is a webhook, we might need custom metadata.
            // Assuming frontend functionality for now as per `confirmBookingPayment` in `bookingController.js`.
            const booking_id = req.query.booking_id || req.body.booking_id;

            if (booking_id) {
                // Perform Split Logic
                // 1. Get Booking and Price
                const bookingRes = await db.query('SELECT b.*, g.price_per_session FROM bookings b JOIN gyms g ON b.gym_id = g.id WHERE b.id = $1', [booking_id]);

                if (bookingRes.rows.length === 0) {
                    return res.status(404).json({ message: 'Booking not found' });
                }

                const booking = bookingRes.rows[0];
                const amount = parseFloat(booking.price_per_session);

                // 2. Get Default Commission Rule
                const ruleRes = await db.query('SELECT * FROM commission_rules WHERE is_default = TRUE LIMIT 1');
                const rule = ruleRes.rows[0];

                let commissionAmount = 0;
                if (rule) {
                    if (rule.type === 'percentage') {
                        commissionAmount = (amount * parseFloat(rule.value)) / 100;
                    } else {
                        commissionAmount = parseFloat(rule.value);
                    }
                }
                // Safety cap
                if (commissionAmount > amount) commissionAmount = amount;

                const ownerAmount = amount - commissionAmount;

                // 3. Insert into payments
                try {
                    await db.query('BEGIN');
                    await db.query(
                        "INSERT INTO payments (booking_id, amount, commission_amount, gym_owner_amount, commission_rule_id, status, transaction_id) VALUES ($1, $2, $3, $4, $5, 'completed', $6)",
                        [booking_id, amount, commissionAmount, ownerAmount, rule ? rule.id : null, transaction_id]
                    );

                    // 4. Update Booking
                    await db.query(
                        "UPDATE bookings SET status = 'confirmed', payment_status = 'verified' WHERE id = $1",
                        [booking_id]
                    );
                    await db.query('COMMIT');
                } catch (err) {
                    await db.query('ROLLBACK');
                    console.error("Payment recording error", err);
                    // Still return success for transaction verification, but log error?
                    // Or return error?
                    return res.status(500).json({ message: 'Failed to record payment split', error: err.message });
                }
            } else {
                console.warn("Transaction verified but no booking_id provided to link.");
            }
        }

        res.status(200).json({ status: transaction.status, transaction });
    } catch (error) {
        console.error('FedaPay Verification Error:', error);
        res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await db.query(`
            SELECT p.*, b.booking_date, u.name as user_name, g.name as gym_name 
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN users u ON b.user_id = u.id
            JOIN gyms g ON b.gym_id = g.id
            ORDER BY p.created_at DESC
        `);
        res.json({ success: true, payments: payments.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
