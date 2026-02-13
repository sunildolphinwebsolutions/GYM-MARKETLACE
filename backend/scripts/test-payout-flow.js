const axios = require('axios');
const db = require('../db');

const API_URL = 'http://localhost:5000/api';

async function testPayoutFlow() {
    try {
        console.log('--- Starting Payout Flow Test ---');

        // 1. Create Gym Owner
        const ownerEmail = `owner_${Date.now()}@test.com`;
        const ownerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Owner',
            email: ownerEmail,
            password: 'password123',
            role: 'gym_owner'
        });
        const ownerToken = ownerRes.data.token;
        const ownerId = ownerRes.data.user.id;
        console.log(`Step 1: Gym Owner created (ID: ${ownerId})`);

        // 2. Create Gym
        const gymRes = await axios.post(`${API_URL}/gyms`, {
            name: 'Payout Test Gym',
            location: 'Test City',
            price_per_session: 100,
            description: 'Test Gym'
        }, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        const gymId = gymRes.data.gym.id;
        console.log(`Step 2: Gym created (ID: ${gymId})`);

        // 3. Create User
        const userEmail = `user_${Date.now()}@test.com`;
        const userRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: userEmail,
            password: 'password123',
            role: 'user'
        });
        const userToken = userRes.data.token;
        const userId = userRes.data.user.id;
        console.log(`Step 3: User created (ID: ${userId})`);

        // 4. Create Booking
        const bookingRes = await axios.post(`${API_URL}/bookings`, {
            gym_id: gymId,
            booking_date: new Date().toISOString().split('T')[0]
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const bookingId = bookingRes.data.booking.id;
        console.log(`Step 4: Booking created (ID: ${bookingId})`);

        // 5. Process Payment (Simulate 100 payment, 10 commission, 90 owner)
        // We need to manually insert a payment because usually payment is handled via Stripe webhook or similar
        await db.query(`
            INSERT INTO payments (booking_id, amount, commission_amount, gym_owner_amount, status, created_at)
            VALUES ($1, 100.00, 10.00, 90.00, 'completed', NOW())
        `, [bookingId]);
        console.log('Step 5: Payment processed manually (Amount: 100, Owner: 90)');

        // 6. Check Stats (Should have 90 pending)
        const statsRes = await axios.get(`${API_URL}/payouts/stats`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        if (statsRes.data.pendingBalance !== 90) {
            throw new Error(`Expected pending balance 90, got ${statsRes.data.pendingBalance}`);
        }
        console.log('Step 6: Stats verified (Pending Balance: 90)');

        // 7. Request Payout
        const payoutRes = await axios.post(`${API_URL}/payouts/request`, {}, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        if (!payoutRes.data.success) {
            throw new Error('Payout request failed');
        }
        const payoutId = payoutRes.data.payout.id;
        console.log(`Step 7: Payout requested (ID: ${payoutId})`);

        // 8. Verify Pending Balance is now 0
        const statsRes2 = await axios.get(`${API_URL}/payouts/stats`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        if (statsRes2.data.pendingBalance !== 0) {
            throw new Error(`Expected pending balance 0, got ${statsRes2.data.pendingBalance}`);
        }
        console.log('Step 8: Stats verified (Pending Balance: 0)');

        console.log('--- Test Passed Successfully ---');
        process.exit(0);
    } catch (err) {
        console.error('--- Test Failed ---');
        console.error(err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

testPayoutFlow();
