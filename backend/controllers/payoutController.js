const db = require('../db');

exports.getPayoutStats = async (req, res) => {
    try {
        const gymOwnerId = req.user.id;

        // Total Earned (Total payments for this owner's gyms)
        const totalEarnedResult = await db.query(`
            SELECT COALESCE(SUM(gym_owner_amount), 0) as total
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN gyms g ON b.gym_id = g.id
            WHERE g.owner_id = $1 AND p.status = 'completed'
        `, [gymOwnerId]);

        // Pending Balance (Payments not yet paid out)
        const pendingBalanceResult = await db.query(`
            SELECT COALESCE(SUM(gym_owner_amount), 0) as total
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN gyms g ON b.gym_id = g.id
            WHERE g.owner_id = $1 AND p.status = 'completed' AND p.payout_id IS NULL
        `, [gymOwnerId]);

        // Last Payout
        const lastPayoutResult = await db.query(`
            SELECT amount, created_at
            FROM payouts
            WHERE gym_owner_id = $1
            ORDER BY created_at DESC
            LIMIT 1
        `, [gymOwnerId]);

        res.json({
            success: true,
            totalEarned: parseFloat(totalEarnedResult.rows[0].total),
            pendingBalance: parseFloat(pendingBalanceResult.rows[0].total),
            lastPayout: lastPayoutResult.rows[0] || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getPayoutHistory = async (req, res) => {
    try {
        const gymOwnerId = req.user.id;
        const result = await db.query(`
            SELECT * FROM payouts
            WHERE gym_owner_id = $1
            ORDER BY created_at DESC
        `, [gymOwnerId]);

        res.json({ success: true, payouts: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getAllPayouts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, u.name as gym_owner_name, u.email as gym_owner_email
            FROM payouts p
            JOIN users u ON p.gym_owner_id = u.id
            ORDER BY 
                CASE WHEN p.status = 'pending' THEN 0 ELSE 1 END,
                p.created_at DESC
        `);

        res.json({ success: true, payouts: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.requestPayout = async (req, res) => {
    try {
        const gymOwnerId = req.user.id;

        // Calculate pending amount again to be safe
        const pendingBalanceResult = await db.query(`
            SELECT COALESCE(SUM(gym_owner_amount), 0) as total, array_agg(p.id) as payment_ids
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN gyms g ON b.gym_id = g.id
            WHERE g.owner_id = $1 AND p.status = 'completed' AND p.payout_id IS NULL
        `, [gymOwnerId]);

        const amount = parseFloat(pendingBalanceResult.rows[0].total);
        const paymentIds = pendingBalanceResult.rows[0].payment_ids;

        if (amount <= 0) {
            return res.status(400).json({ success: false, error: 'No pending balance to request payout' });
        }

        // Start transaction
        await db.query('BEGIN');

        // Create Payout Record
        const payoutResult = await db.query(`
            INSERT INTO payouts (gym_owner_id, amount, status)
            VALUES ($1, $2, 'pending')
            RETURNING *
        `, [gymOwnerId, amount]);

        const payoutId = payoutResult.rows[0].id;

        // Link payments to this payout
        if (paymentIds && paymentIds.length > 0) {
            await db.query(`
                UPDATE payments
                SET payout_id = $1
                WHERE id = ANY($2::int[])
            `, [payoutId, paymentIds]);
        }

        await db.query('COMMIT');

        res.json({ success: true, payout: payoutResult.rows[0] });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updatePayoutStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, transaction_ref } = req.body;

        if (!['pending', 'processed', 'paid', 'failed'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const result = await db.query(`
            UPDATE payouts
            SET status = $1, transaction_ref = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `, [status, transaction_ref, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Payout not found' });
        }

        res.json({ success: true, payout: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
