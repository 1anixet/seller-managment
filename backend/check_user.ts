
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'admin@seller.com' });
        if (user) {
            console.log('User found:', {
                email: user.email,
                role: user.role,
                isActive: user.isActive
            });
        } else {
            console.log('User NOT found: admin@seller.com');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkUser();
