const axios = require('axios');
const db = require('../db');

const API_URL = 'http://localhost:5000/api';

async function testAdminFetchPayouts() {
    try {
        console.log('--- Starting Admin Fetch Payouts Test ---');

        // 1. Create Admin (if not exists, or create new one)
        const adminEmail = `admin_list_${Date.now()}@test.com`;
        const adminRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Admin List',
            email: adminEmail,
            password: 'password123',
            role: 'admin'
        });
        const adminToken = adminRes.data.token;
        console.log(`Step 1: Admin created`);

        // 2. Fetch Payouts
        const listRes = await axios.get(`${API_URL}/payouts/all`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (listRes.data.success && Array.isArray(listRes.data.payouts)) {
            console.log(`Step 2: Fetched ${listRes.data.payouts.length} payouts`);
        } else {
            throw new Error('Failed to fetch payouts');
        }

        console.log('--- Test Passed Successfully ---');
        process.exit(0);
    } catch (err) {
        console.error('--- Test Failed ---');
        console.error(err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

testAdminFetchPayouts();
