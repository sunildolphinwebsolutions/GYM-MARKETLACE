const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

console.log('DB URL defined:', !!process.env.DATABASE_URL);


async function runSchema() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
        await pool.query(sql);
        console.log('Schema applied successfully');
    } catch (err) {
        console.error('Error applying schema', err);
    } finally {
        await pool.end();
    }
}

runSchema();
