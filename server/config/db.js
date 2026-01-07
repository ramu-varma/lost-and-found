const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s for faster debugging
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        if (error.message.includes('ECONNREFUSED')) {
            console.error('TIP: This looks like a DNS or Network issue. Check your connection string and IP whitelist.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
