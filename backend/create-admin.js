const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createAdmin() {
    try {
        const email = 'admin@example.com';
        const password = 'adminpassword';
        const name = 'Admin User';
        const role = 'admin';

        // Check if exists first
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            console.log('Admin user already exists.');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
            [name, email, hashedPassword, role]
        );

        console.log(`Admin user created.\nEmail: ${email}\nPassword: ${password}`);

    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await pool.end();
    }
}

createAdmin();
