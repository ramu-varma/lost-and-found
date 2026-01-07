const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config();

const promoteUser = async () => {
    const email = process.argv[2];

    if (!email) {
        console.log('Please provide a user email: node promoteAdmin.js <email>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        user.role = 'ADMIN';
        await user.save();

        console.log(`User ${email} promoted to ADMIN successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

promoteUser();
