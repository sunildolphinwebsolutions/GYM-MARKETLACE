const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        const testUser = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'user'
        };

        console.log('1. Registering user...');
        const registerRes = await axios.post(`${API_URL}/register`, testUser);
        console.log('Registration successful:', registerRes.data);

        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login successful:', loginRes.data);

        if (loginRes.data.token) {
            console.log('\nToken received successfully.');
        } else {
            console.error('\nNo token received!');
        }

    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
};

testAuth();
