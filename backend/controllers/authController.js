const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const register = async (req, res) => {
    console.log('Register request received:', req.body);
    const { name, email, password, role } = req.body;

    try {
        // Validate role
        if (!['user', 'gym_owner', 'admin'].includes(role)) {
            console.log('Invalid role:', role);
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        // Check if user exists
        console.log('Checking if user exists:', email);
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('User check result:', userCheck.rows.length);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        console.log('Creating user in DB...');
        const newUser = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
            [name, email, hashedPassword, role]
        );
        console.log('User created:', newUser.rows[0]);

        // Create token
        const payload = {
            user: {
                id: newUser.rows[0].id,
                role: newUser.rows[0].role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        console.log('Token generated');

        res.json({ success: true, token, user: newUser.rows[0] });

    } catch (err) {
        console.error('Register Error:', err.message);
        console.error(err.stack);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    register,
    login
};
