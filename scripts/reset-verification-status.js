// scripts/reset-verification-status.js
// Run with: node scripts/reset-verification-status.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not set in .env.local');
  }
  
  const dbName = process.env.MONGODB_DBNAME || "SIH_Project";
  await mongoose.connect(process.env.MONGODB_URI, { dbName });
  console.log('Connected to:', mongoose.connection.name);
};

const resetVerificationStatus = async () => {
  try {
    await connectToDatabase();
    
    // Reset all officers to unverified (they'll need OTP)
    const officersResult = await mongoose.connection.db.collection('officers').updateMany(
      {},
      { 
        $set: { 
          is_verified: false,
          otp_hash: null,
          otp_expires: null,
          otp_attempts: 0,
          aadhaar_verified: false
        }
      }
    );
    
    // Reset all users to unverified (they'll need OTP)  
    const usersResult = await mongoose.connection.db.collection('users').updateMany(
      {},
      { 
        $set: { 
          is_verified: false,
          otp_hash: null,
          otp_expires: null,
          otp_attempts: 0
        }
      }
    );
    
    console.log(`Updated ${officersResult.modifiedCount} officers`);
    console.log(`Updated ${usersResult.modifiedCount} users`);
    console.log('✅ All users reset to unverified - they will need OTP on next login');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

resetVerificationStatus();
