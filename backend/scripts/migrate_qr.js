
const db = require('../db');

async function runMigration() {
    try {
        console.log('Starting migration for QR Payment...');

        // Add payment fields to bookings
        await db.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_reference_id') THEN 
                    ALTER TABLE bookings ADD COLUMN payment_reference_id VARCHAR(50); 
                END IF; 

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_status') THEN 
                    ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending'; 
                END IF;
            END $$;
        `);
        console.log('Added payment fields to bookings');

        // Add qr_code to gyms with default
        await db.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gyms' AND column_name='qr_code') THEN 
                    ALTER TABLE gyms ADD COLUMN qr_code VARCHAR(255) DEFAULT '/img/images.png'; 
                END IF; 
            END $$;
        `);
        console.log('Added qr_code to gyms');

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
