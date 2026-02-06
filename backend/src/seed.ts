import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { hashPassword } from './utils/auth';
import User from './models/User';
import Category from './models/Category';
import Item from './models/Item';
import Branch from './models/Branch';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seller-management');
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Item.deleteMany({}),
            Branch.deleteMany({}),
        ]);
        console.log('🗑️  Cleared existing data');

        // Create default branch
        const defaultBranch = await Branch.create({
            name: 'Main Branch',
            code: 'MAIN001',
            address: {
                street: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
            },
            contact: {
                phone: '+91 9876543210',
                email: 'main@seller.com',
            },
            isActive: true,
        });
        console.log('🏢 Created default branch');

        // Create admin user
        const adminPassword = await hashPassword('password123');
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@seller.com',
            password: adminPassword,
            role: 'owner',
            branchId: defaultBranch._id,
            profile: {
                firstName: 'Admin',
                lastName: 'User',
                phone: '+91 9876543210',
            },
            isActive: true,
        });
        console.log('👤 Created admin user');

        // Create categories
        const categories = await Category.create([
            { name: 'Beverages', slug: 'beverages', color: '#3B82F6', icon: '☕' },
            { name: 'Food', slug: 'food', color: '#10B981', icon: '🍕' },
            { name: 'Snacks', slug: 'snacks', color: '#F59E0B', icon: '🍿' },
            { name: 'Desserts', slug: 'desserts', color: '#EC4899', icon: '🍰' },
            { name: 'Retail', slug: 'retail', color: '#8B5CF6', icon: '🛍️' },
        ]);
        console.log('📂 Created categories');

        // Create sample items
        const items = await Item.create([
            {
                name: 'Cappuccino',
                sku: 'BEV-CAP-001',
                category: categories[0]._id,
                description: 'Classic Italian coffee with steamed milk',
                images: [],
                pricing: { costPrice: 30, sellingPrice: 80 },
                stock: { quantity: 100, unit: 'cup', lowStockThreshold: 20 },
                tags: ['coffee', 'hot'],
                isActive: true,
                createdBy: adminUser._id,
                branchId: defaultBranch._id,
            },
            {
                name: 'Latte',
                sku: 'BEV-LAT-002',
                category: categories[0]._id,
                description: 'Espresso with steamed milk and foam',
                images: [],
                pricing: { costPrice: 35, sellingPrice: 90 },
                stock: { quantity: 80, unit: 'cup', lowStockThreshold: 15 },
                tags: ['coffee', 'hot'],
                isActive: true,
                createdBy: adminUser._id,
                branchId: defaultBranch._id,
            },
            {
                name: 'Margherita Pizza',
                sku: 'FOO-MAR-001',
                category: categories[1]._id,
                description: 'Classic pizza with tomato sauce and cheese',
                images: [],
                pricing: { costPrice: 120, sellingPrice: 299 },
                stock: { quantity: 50, unit: 'pc', lowStockThreshold: 10 },
                tags: ['pizza', 'vegetarian'],
                isActive: true,
                createdBy: adminUser._id,
                branchId: defaultBranch._id,
            },
            {
                name: 'French Fries',
                sku: 'SNA-FRI-001',
                category: categories[2]._id,
                description: 'Crispy golden fries',
                images: [],
                pricing: { costPrice: 25, sellingPrice: 79 },
                stock: { quantity: 8, unit: 'pack', lowStockThreshold: 10 },
                tags: ['fries', 'snack'],
                isActive: true,
                createdBy: adminUser._id,
                branchId: defaultBranch._id,
            },
            {
                name: 'Chocolate Cake',
                sku: 'DES-CHO-001',
                category: categories[3]._id,
                description: 'Rich chocolate cake slice',
                images: [],
                pricing: { costPrice: 40, sellingPrice: 120 },
                stock: { quantity: 25, unit: 'slice', lowStockThreshold: 5 },
                tags: ['dessert', 'chocolate'],
                isActive: true,
                createdBy: adminUser._id,
                branchId: defaultBranch._id,
            },
        ]);
        console.log('📦 Created sample items');

        console.log('\n✨ Database seeded successfully!');
        console.log('\n📋 Demo Credentials:');
        console.log('   Email: admin@seller.com');
        console.log('   Password: password123\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
