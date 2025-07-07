const axios = require('axios');

const API_BASE_URL = 'https://masterly-deploy-production.up.railway.app';

// Configure axios to include credentials
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function testConnection() {
    console.log('🔍 Testing Masterly API Connection...\n');

    try {
        // Test 1: Health Check
        console.log('1. Testing Health Endpoint...');
        const healthResponse = await api.get('/api/health');
        console.log('✅ Health Check:', healthResponse.data);
        console.log('Status:', healthResponse.status);
        console.log('Headers:', healthResponse.headers);
        console.log('');

        // Test 2: Root Endpoint
        console.log('2. Testing Root Endpoint...');
        const rootResponse = await api.get('/');
        console.log('✅ Root Endpoint:', rootResponse.data);
        console.log('');

        // Test 3: Test Login with Invalid Credentials
        console.log('3. Testing Login Endpoint (Invalid Credentials)...');
        try {
            const loginResponse = await api.post('/api/auth/login', {
                email: 'test@test.com',
                password: 'wrongpassword'
            });
            console.log('❌ Unexpected success:', loginResponse.data);
        } catch (error) {
            console.log('✅ Expected error for invalid credentials:');
            console.log('Status:', error.response?.status);
            console.log('Message:', error.response?.data?.message);
        }
        console.log('');

        // Test 4: Test Registration with Valid Data
        console.log('4. Testing Registration Endpoint...');
        const testEmail = `test${Date.now()}@example.com`;
        try {
            const registerResponse = await api.post('/api/auth/register', {
                firstName: 'Test',
                lastName: 'User',
                email: testEmail,
                password: 'TestPassword123!'
            });
            console.log('✅ Registration successful:', registerResponse.data);
            console.log('Cookies received:', registerResponse.headers['set-cookie']);
            console.log('');

            // Test 5: Test Login with Valid Credentials
            console.log('5. Testing Login Endpoint (Valid Credentials)...');
            const loginResponse = await api.post('/api/auth/login', {
                email: testEmail,
                password: 'TestPassword123!'
            });
            console.log('✅ Login successful:', loginResponse.data);
            console.log('Cookies received:', loginResponse.headers['set-cookie']);
            console.log('');

            // Test 6: Test Get Current User
            console.log('6. Testing Get Current User...');
            const userResponse = await api.get('/api/auth/me');
            console.log('✅ Current user:', userResponse.data);
            console.log('');

            // Test 7: Test Logout
            console.log('7. Testing Logout...');
            const logoutResponse = await api.post('/api/auth/logout');
            console.log('✅ Logout successful:', logoutResponse.data);
            console.log('');

        } catch (error) {
            console.log('❌ Registration failed:', error.response?.data?.message || error.message);
        }

    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        }
    }
}

// Run the test
testConnection(); 