const mongoose = require('mongoose');

// Test your MongoDB connection
const testConnection = async () => {
  try {
    // Replace this with your actual connection string
    const uri = 'mongodb+srv://masterly_user:Masterly123!@cluster0.uuq6vjh.mongodb.net/masterly?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔍 Testing MongoDB connection...');
    
    const conn = await mongoose.connect(uri);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.db?.databaseName}`);
    
    // Test database operations
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔧 Authentication Error - Try:');
      console.log('1. Create a new MongoDB user');
      console.log('2. Use Railway MongoDB plugin instead');
    }
  }
};

testConnection(); 