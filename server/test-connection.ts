import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI;
    console.log('📍 Connection URI:', mongoUri?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000 // 10 second timeout
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test database operations
    console.log('📊 Testing database operations...');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log('📈 Database stats:', {
      collections: stats.collections,
      documents: stats.objects,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
    });
    
    console.log('🎉 Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔐 Connection closed');
    process.exit(0);
  }
}

// Run the test
testConnection();
