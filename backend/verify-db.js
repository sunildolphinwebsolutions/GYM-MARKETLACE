const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL');
        const res = await client.query('SELECT NOW()');
        console.log('Database time:', res.rows[0].now);
        client.release();
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error('Connection error', err.stack);
        process.exit(1);
    }
}

checkConnection();
