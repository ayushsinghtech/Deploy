const mongoose = require('mongoose');

// Test MongoDB connection
async function testConnection() {
  try {
    // Get the connection string from environment or use a test one
    const mongoUri = process.env.MONGODB_URI || 'your-mongodb-connection-string-here';
    
    console.log('Testing MongoDB connection...');
    console.log('URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    const conn = await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db?.databaseName}`);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔧 Authentication Error - Check:');
      console.log('1. Username and password are correct');
      console.log('2. Password is URL-encoded if it contains special characters');
      console.log('3. Database name is correct');
    }
    
    process.exit(1);
  }
}

testConnection(); 