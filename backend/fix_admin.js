
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is installed
require('dotenv').config();

const fixAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seller-management');
        console.log('Connected.');

        // Define User Schema inline to avoid import issues
        const userSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, enum: ['owner', 'manager', 'cashier'], default: 'cashier' },
            branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
            profile: {
                firstName: String,
                lastName: String,
                phone: String
            },
            isActive: { type: Boolean, default: true },
            lastLogin: Date
        }, { timestamps: true });

        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const email = 'admin@seller.com';
        const password = 'password123';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Admin user already exists. Updating password...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            existingUser.password = hashedPassword;
            existingUser.isActive = true;
            await existingUser.save();
            console.log('Admin user updated.');
        } else {
            console.log('Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                username: 'admin',
                email,
                password: hashedPassword,
                role: 'owner',
                profile: {
                    firstName: 'Admin',
                    lastName: 'User'
                },
                isActive: true
            });
            console.log('Admin user created.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

fixAdmin();
