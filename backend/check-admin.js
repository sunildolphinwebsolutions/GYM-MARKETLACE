const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkAdmin() {
    try {
        const res = await pool.query("SELECT * FROM users WHERE role = 'admin'");
        if (res.rows.length > 0) {
            console.log('Admin user found:');
            res.rows.forEach(u => console.log(`- Email: ${u.email}, Password: [HIDDEN]`));
        } else {
            console.log('No admin user found.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

checkAdmin();
