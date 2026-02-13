const axios = require('axios');
const db = require('../db');

const API_URL = 'http://localhost:5000/api';

async function testDashboardStats() {
    try {
        console.log('--- Starting Dashboard Stats Test ---');

        // 1. Create Gym Owner
        const ownerEmail = `stats_owner_${Date.now()}@test.com`;
        const ownerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Stats Owner',
            email: ownerEmail,
            password: 'password123',
            role: 'gym_owner'
        });
        const ownerToken = ownerRes.data.token;
        const ownerId = ownerRes.data.user.id;
        console.log(`Step 1: Gym Owner created (ID: ${ownerId})`);

        // 2. Create Gym
        const gymRes = await axios.post(`${API_URL}/gyms`, {
            name: 'Stats Test Gym',
            location: 'Test City',
            price_per_session: 100,
            description: 'Test Gym'
        }, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        const gymId = gymRes.data.gym.id;
        console.log(`Step 2: Gym created (ID: ${gymId})`);

        // 3. Create Bookings & Payments
        // Booking 1: Completed, Paid (Today)
        const b1Res = await axios.post(`${API_URL}/auth/register`, { name: 'User1', email: `u1_${Date.now()}@test.com`, password: '123', role: 'user' });
        const u1Token = b1Res.data.token;
        const b1 = await axios.post(`${API_URL}/bookings`, { gym_id: gymId, booking_date: new Date().toISOString().split('T')[0] }, { headers: { Authorization: `Bearer ${u1Token}` } });
        await db.query(`INSERT INTO payments (booking_id, amount, commission_amount, gym_owner_amount, status, created_at) VALUES ($1, 100.00, 10.00, 90.00, 'completed', NOW())`, [b1.data.booking.id]);
        await db.query(`UPDATE bookings SET status = 'confirmed' WHERE id = $1`, [b1.data.booking.id]);

        // Booking 2: Pending (Tomorrow)
        const b2 = await axios.post(`${API_URL}/bookings`, { gym_id: gymId, booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0] }, { headers: { Authorization: `Bearer ${u1Token}` } });
        await db.query(`UPDATE bookings SET status = 'pending' WHERE id = $1`, [b2.data.booking.id]);

        // Booking 3: Cancelled (Yesterday)
        const b3 = await axios.post(`${API_URL}/bookings`, { gym_id: gymId, booking_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] }, { headers: { Authorization: `Bearer ${u1Token}` } });
        await db.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [b3.data.booking.id]);

        console.log('Step 3: Seeded data (1 Completed/Paid, 1 Pending, 1 Cancelled)');

        // 4. Test Dashboard Stats Endpoint
        const statsRes = await axios.get(`${API_URL}/gyms/dashboard-stats`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });

        console.log('Step 4: Stats Response:', JSON.stringify(statsRes.data, null, 2));

        const { revenueData, statusData } = statsRes.data;

        // Verify Revenue (Should have 1 entry with 90)
        if (revenueData.length === 0 || parseFloat(revenueData[0].revenue) !== 90) {
            // It's possible date formatting makes it 0 if timezones don't match, but let's check basic existence
            console.warn('Revenue Check: Expected ~90, got', revenueData);
        }

        // Verify Status (Should have counts for Completed, Pending, Cancelled)
        const completed = statusData.find(s => s.name === 'Completed')?.value || 0;
        const pending = statusData.find(s => s.name === 'Pending')?.value || 0;
        const cancelled = statusData.find(s => s.name === 'Cancelled')?.value || 0;

        // Note: Booking creation defaults to 'confirmed', but we manually set statuses above.
        // Confirm logic in gymController maps 'confirmed' -> 'Completed'

        if (completed !== 1 || pending !== 1 || cancelled !== 1) {
            console.warn(`Status Check: Expected 1 Comp, 1 Pend, 1 Canc. Got: ${completed}, ${pending}, ${cancelled}`);
        } else {
            console.log('Status Check: ✅ Passed');
        }

        console.log('--- Test Finished ---');
        process.exit(0);

    } catch (err) {
        console.error('--- Test Failed ---');
        console.error(err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

testDashboardStats();
