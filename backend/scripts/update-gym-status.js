
const db = require('../db');

async function updateGymStatus() {
    try {
        console.log('Updating gym status constraint...');

        // Drop existing constraint - assuming the default name is gyms_status_check or we need to find it.
        // Usually postgres names it table_column_check. here 'gyms_status_check'.
        // To be safe, we can try to drop it if it exists.

        await db.query(`
            ALTER TABLE gyms 
            DROP CONSTRAINT IF EXISTS gyms_status_check;
        `);

        await db.query(`
            ALTER TABLE gyms 
            ADD CONSTRAINT gyms_status_check 
            CHECK (status IN ('draft', 'pending_approval', 'published', 'rejected'));
        `);

        console.log('Successfully updated gym status constraint.');
    } catch (error) {
        console.error('Error updating gym status:', error);
    } finally {
        process.exit();
    }
}

updateGymStatus();
