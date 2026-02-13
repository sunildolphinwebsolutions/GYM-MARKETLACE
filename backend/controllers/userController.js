const db = require('../db');

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const userId = req.user.id;

        const result = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        // Check if email is taken by another user
        const emailCheck = await db.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2',
            [email, userId]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const result = await db.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role, created_at',
            [name, email, userId]
        );

        res.json({ success: true, message: 'Profile updated successfully', user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}



