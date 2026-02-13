
const db = require('../db');

async function runMigration() {
    try {
        console.log('Starting migration...');

        // Add stripe_account_id to users
        await db.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stripe_account_id') THEN 
                    ALTER TABLE users ADD COLUMN stripe_account_id VARCHAR(255); 
                END IF; 
            END $$;
        `);
        console.log('Added stripe_account_id to users');

        // Add stripe_payment_intent_id and payment_status to bookings
        await db.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='stripe_payment_intent_id') THEN 
                    ALTER TABLE bookings ADD COLUMN stripe_payment_intent_id VARCHAR(255); 
                END IF; 

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_status') THEN 
                    ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending'; 
                END IF;
            END $$;
        `);
        console.log('Added payment fields to bookings');

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
