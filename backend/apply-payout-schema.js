const fs = require('fs');
const path = require('path');
const db = require('./db');

async function applySchema() {
    try {
        const schemaPath = path.join(__dirname, 'schema-payouts.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying payout schema...');
        await db.query(schema);
        console.log('Payout schema applied successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error applying schema:', err);
        process.exit(1);
    }
}

applySchema();
