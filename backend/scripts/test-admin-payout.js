const axios = require('axios');
const db = require('../db');

const API_URL = 'http://localhost:5000/api';

async function testAdminPayout() {
    try {
        console.log('--- Starting Admin Payout Test ---');

        // 1. Create Admin
        const adminEmail = `admin_${Date.now()}@test.com`;
        const adminRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Admin',
            email: adminEmail,
            password: 'password123',
            role: 'admin'
        });
        const adminToken = adminRes.data.token;
        console.log(`Step 1: Admin created`);

        // 2. Create Gym Owner & request payout (reuse logic or just insert directly)
        // Let's insert a payout directly for simplicity
        const ownerEmail = `owner_${Date.now()}@test.com`;
        const ownerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Owner',
            email: ownerEmail,
            password: 'password123',
            role: 'gym_owner'
        });
        const ownerId = ownerRes.data.user.id;

        const payoutRes = await db.query(`
            INSERT INTO payouts (gym_owner_id, amount, status)
            VALUES ($1, 200.00, 'pending')
            RETURNING id
        `, [ownerId]);
        const payoutId = payoutRes.rows[0].id;
        console.log(`Step 2: Payout created manually (ID: ${payoutId})`);

        // 3. Admin Updates Status to 'paid'
        const updateRes = await axios.put(`${API_URL}/payouts/${payoutId}/status`, {
            status: 'paid',
            transaction_ref: 'REF123456'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (updateRes.data.success && updateRes.data.payout.status === 'paid') {
            console.log('Step 3: Status updated to PAID');
        } else {
            throw new Error('Failed to update status');
        }

        console.log('--- Test Passed Successfully ---');
        process.exit(0);
    } catch (err) {
        console.error('--- Test Failed ---');
        console.error(err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

testAdminPayout();
