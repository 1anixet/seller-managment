import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
    name: string;
    code: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    contact: {
        phone: string;
        email?: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BranchSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Branch name is required'],
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'Branch code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        address: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
            },
        },
        contact: {
            phone: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
BranchSchema.index({ code: 1 }, { unique: true });
BranchSchema.index({ isActive: 1 });

export default mongoose.model<IBranch>('Branch', BranchSchema);
