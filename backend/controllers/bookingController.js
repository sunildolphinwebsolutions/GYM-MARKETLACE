const db = require('../db');

// Create a booking
exports.createBooking = async (req, res) => {
    const client = await db.pool.connect();
    try {
        const { gym_id, booking_date } = req.body;
        const user_id = req.user.id;

        // Get user details for payment
        const userRes = await client.query('SELECT * FROM users WHERE id = $1', [user_id]);
        const user = userRes.rows[0];

        await client.query('BEGIN');

        // Check availability logic (omitted for brevity, same as before) ...
        // ... (Keep existing checks for existing booking and capacity)

        const gym = await client.query(
            'SELECT capacity, price_per_session, name FROM gyms WHERE id = $1 FOR UPDATE',
            [gym_id]
        );

        if (gym.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }

        const capacity = gym.rows[0].capacity;
        const price = gym.rows[0].price_per_session;
        const gymName = gym.rows[0].name;

        // Count bookings ... (Keep existing logic)
        const currentBookings = await client.query(
            'SELECT COUNT(*) FROM bookings WHERE gym_id = $1 AND booking_date = $2 AND status IN (\'confirmed\', \'pending\')',
            [gym_id, booking_date]
        );

        if (parseInt(currentBookings.rows[0].count) >= capacity) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Gym is fully booked for this date' });
        }

        // Create booking with 'pending_payment' status
        const newBooking = await client.query(
            'INSERT INTO bookings (user_id, gym_id, booking_date, status, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, gym_id, booking_date, 'pending', 'pending'] // Keeping 'pending' to reserve slot, but will need payment
        );

        // Initiate FedaPay Transaction
        const { Transaction, FedaPay } = require('fedapay');
        // Ensure FedaPay is configured (it should be if paymentController is loaded, but safe to set here or in index)
        FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
        FedaPay.setEnvironment(process.env.FEDAPAY_ENVIRONMENT || 'sandbox');

        const transaction = await Transaction.create({
            description: `Booking for ${gymName} on ${booking_date}`,
            amount: parseInt(price), // Ensure amount is an integer
            currency: { iso: 'XOF' },
            callback_url: `http://localhost:3000/payment/callback?booking_id=${newBooking.rows[0].id}`, // Frontend callback
            customer: {
                email: user.email,
                lastname: user.name.split(' ').pop() || 'User',
                firstname: user.name.split(' ')[0] || 'Gym',
            }
        });

        const token = await transaction.generateToken();

        // Update booking with transaction ID (optional, or store in separate table? storing in payment_reference_id for now)
        await client.query(
            'UPDATE bookings SET payment_reference_id = $1 WHERE id = $2',
            [transaction.id, newBooking.rows[0].id]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            booking: newBooking.rows[0],
            payment_url: token.url
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Create Booking Error:', err);
        if (err.response && err.response.data) {
            console.error('FedaPay API Error Details:', JSON.stringify(err.response.data, null, 2));
        }
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    } finally {
        client.release();
    }
};

// Confirm payment (called after successful FedaPay callback)
exports.confirmBookingPayment = async (req, res) => {
    try {
        const { booking_id, transaction_id } = req.body;

        // Verify transaction status with FedaPay 
        const { Transaction } = require('fedapay');
        const transaction = await Transaction.retrieve(transaction_id);

        if (transaction.status === 'approved') { // Verify correct status from FedaPay docs

            // Check if payment already recorded to avoid duplicates
            const existingPayment = await db.query('SELECT * FROM payments WHERE transaction_id = $1', [transaction_id]);
            if (existingPayment.rows.length > 0) {
                const updatedBooking = await db.query(
                    "UPDATE bookings SET status = 'confirmed', payment_status = 'verified' WHERE id = $1 RETURNING *",
                    [booking_id]
                );
                return res.json({ success: true, booking: updatedBooking.rows[0], message: 'Payment already processed' });
            }

            // Perform Split Logic
            // 1. Get Booking and Price
            const bookingRes = await db.query('SELECT b.*, g.price_per_session FROM bookings b JOIN gyms g ON b.gym_id = g.id WHERE b.id = $1', [booking_id]);

            if (bookingRes.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
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

            // 3. Record Payment & Update Booking
            await db.query('BEGIN');
            try {
                await db.query(
                    "INSERT INTO payments (booking_id, amount, commission_amount, gym_owner_amount, commission_rule_id, status, transaction_id) VALUES ($1, $2, $3, $4, $5, 'completed', $6)",
                    [booking_id, amount, commissionAmount, ownerAmount, rule ? rule.id : null, transaction_id]
                );

                const updatedBooking = await db.query(
                    "UPDATE bookings SET status = 'confirmed', payment_status = 'verified' WHERE id = $1 RETURNING *",
                    [booking_id]
                );

                await db.query('COMMIT');
                return res.json({ success: true, booking: updatedBooking.rows[0] });

            } catch (err) {
                await db.query('ROLLBACK');
                console.error("Payment recording error", err);
                return res.status(500).json({ success: false, message: 'Failed to record payment split', error: err.message });
            }

        } else {
            return res.status(400).json({ success: false, message: 'Payment not approved' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get bookings for gyms owned by the current user
exports.getOwnerBookings = async (req, res) => {
    try {
        const owner_id = req.user.id;
        const bookings = await db.query(
            `SELECT b.*, g.name as gym_name, u.name as user_name, u.email as user_email
             FROM bookings b 
             JOIN gyms g ON b.gym_id = g.id 
             JOIN users u ON b.user_id = u.id
             WHERE g.owner_id = $1 
             ORDER BY b.booking_date DESC`,
            [owner_id]
        );
        res.json({ success: true, bookings: bookings.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const user_id = req.user.id;
        const bookings = await db.query(
            `SELECT b.*, g.name as gym_name, g.location, g.images, g.price_per_session 
             FROM bookings b 
             JOIN gyms g ON b.gym_id = g.id 
             WHERE b.user_id = $1 
             ORDER BY b.booking_date DESC`,
            [user_id]
        );
        res.json({ success: true, bookings: bookings.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const booking = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);

        if (booking.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.rows[0].user_id !== user_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await db.query('DELETE FROM bookings WHERE id = $1', [id]);

        res.json({ success: true, message: 'Booking cancelled' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Verify a booking (Owner Only)
exports.verifyBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const owner_id = req.user.id; // From auth middleware

        // 1. Get Booking and Gym details to verify owner
        const bookingRes = await db.query(
            `SELECT b.*, g.owner_id 
             FROM bookings b 
             JOIN gyms g ON b.gym_id = g.id 
             WHERE b.id = $1`,
            [id]
        );

        if (bookingRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const booking = bookingRes.rows[0];

        if (booking.owner_id !== owner_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Not the gym owner' });
        }

        // 2. Update status
        const updatedBooking = await db.query(
            "UPDATE bookings SET status = 'confirmed', payment_status = 'verified' WHERE id = $1 AND status = 'pending' RETURNING *",
            [id]
        );

        if (updatedBooking.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Booking is not pending or already handled' });
        }

        res.json({ success: true, booking: updatedBooking.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Reject a booking (Owner Only)
exports.rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const owner_id = req.user.id;

        const bookingRes = await db.query(
            `SELECT b.*, g.owner_id 
             FROM bookings b 
             JOIN gyms g ON b.gym_id = g.id 
             WHERE b.id = $1`,
            [id]
        );

        if (bookingRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const booking = bookingRes.rows[0];

        if (booking.owner_id !== owner_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updatedBooking = await db.query(
            "UPDATE bookings SET status = 'cancelled', payment_status = 'rejected' WHERE id = $1 RETURNING *",
            [id]
        );

        res.json({ success: true, booking: updatedBooking.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Check availability for a specific date
exports.checkAvailability = async (req, res) => {
    try {
        const { gym_id, date } = req.query;

        if (!gym_id || !date) {
            return res.status(400).json({ success: false, message: 'Gym ID and date are required' });
        }

        const gym = await db.query('SELECT capacity FROM gyms WHERE id = $1', [gym_id]);
        if (gym.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }

        const capacity = gym.rows[0].capacity;

        const bookings = await db.query(
            'SELECT COUNT(*) FROM bookings WHERE gym_id = $1 AND booking_date = $2 AND status IN (\'confirmed\', \'pending\')',
            [gym_id, date]
        );

        const bookedCount = parseInt(bookings.rows[0].count);
        const available = capacity - bookedCount;

        res.json({ success: true, available: available > 0 ? available : 0, capacity });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
