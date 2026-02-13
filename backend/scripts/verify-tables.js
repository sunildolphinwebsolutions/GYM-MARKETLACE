const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function verifyTables() {
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('commission_rules', 'payments');
        `);
        console.log('Found tables:', res.rows.map(r => r.table_name));
    } catch (err) {
        console.error('Error querying tables:', err);
    } finally {
        await pool.end();
    }
}

verifyTables();
