import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
    name: string;
    contactPerson?: string;
    email?: string;
    phone: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
    gst?: string;
    items: mongoose.Types.ObjectId[];
    branchId?: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SupplierSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Supplier name is required'],
            trim: true,
        },
        contactPerson: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        gst: {
            type: String,
            uppercase: true,
            trim: true,
        },
        items: [{
            type: Schema.Types.ObjectId,
            ref: 'Item',
        }],
        branchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
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
SupplierSchema.index({ name: 1 });
SupplierSchema.index({ branchId: 1 });
SupplierSchema.index({ isActive: 1 });

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
