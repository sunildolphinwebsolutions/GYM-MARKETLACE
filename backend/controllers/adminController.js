
const db = require('../db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [
            usersRes,
            gymsRes,
            bookingsRes,
            revenueRes
        ] = await Promise.all([
            db.query('SELECT COUNT(*) FROM users'),
            db.query('SELECT COUNT(*) FROM gyms'),
            db.query('SELECT COUNT(*) FROM bookings'),
            db.query('SELECT SUM(commission_amount) as total_commission FROM payments WHERE status = \'completed\'')
        ]);

        const stats = {
            totalUsers: parseInt(usersRes.rows[0].count),
            totalGyms: parseInt(gymsRes.rows[0].count),
            totalBookings: parseInt(bookingsRes.rows[0].count),
            totalRevenue: parseFloat(revenueRes.rows[0].total_commission || 0)
        };

        res.json({ success: true, stats });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getSellers = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, u.created_at, COUNT(g.id) as gym_count
            FROM users u
            LEFT JOIN gyms g ON u.id = g.owner_id
            WHERE u.role = 'gym_owner'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `;
        const result = await db.query(query);
        res.json({ success: true, sellers: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getPendingGyms = async (req, res) => {
    try {
        const query = `
            SELECT g.*, u.name as owner_name, u.email as owner_email
            FROM gyms g
            JOIN users u ON g.owner_id = u.id
            WHERE g.status = 'pending_approval'
            ORDER BY g.created_at ASC
        `;
        const result = await db.query(query);
        res.json({ success: true, gyms: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.approveGym = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'UPDATE gyms SET status = \'published\' WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }

        res.json({ success: true, message: 'Gym approved', gym: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.rejectGym = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'UPDATE gyms SET status = \'rejected\' WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }

        res.json({ success: true, message: 'Gym rejected', gym: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getCommissions = async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                SUM(commission_amount) as total_commission,
                COUNT(*) as total_transactions,
                AVG(commission_amount) as avg_commission
            FROM payments
            WHERE status = 'completed'
        `;

        const rulesQuery = 'SELECT * FROM commission_rules ORDER BY created_at DESC';

        const [statsRes, rulesRes] = await Promise.all([
            db.query(statsQuery),
            db.query(rulesQuery)
        ]);

        res.json({
            success: true,
            stats: statsRes.rows[0],
            rules: rulesRes.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const query = `
            SELECT p.*, g.name as gym_name, u.name as user_name, o.name as owner_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN gyms g ON b.gym_id = g.id
            JOIN users u ON b.user_id = u.id
            JOIN users o ON g.owner_id = o.id
            ORDER BY p.created_at DESC
        `;
        const result = await db.query(query);
        res.json({ success: true, transactions: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
