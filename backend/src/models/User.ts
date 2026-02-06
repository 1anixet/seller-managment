import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'owner' | 'manager' | 'staff' | 'cashier';
    branchId?: mongoose.Types.ObjectId;
    profile: {
        firstName: string;
        lastName: string;
        phone: string;
        avatar?: string;
    };
    permissions: string[];
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['owner', 'manager', 'staff', 'cashier'],
            default: 'staff',
        },
        branchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
        profile: {
            firstName: {
                type: String,
                required: [true, 'First name is required'],
                trim: true,
            },
            lastName: {
                type: String,
                required: [true, 'Last name is required'],
                trim: true,
            },
            phone: {
                type: String,
                trim: true,
            },
            avatar: {
                type: String,
            },
        },
        permissions: [{
            type: String,
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ branchId: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);
