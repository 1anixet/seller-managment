import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    type: 'low_stock' | 'out_of_stock' | 'high_value_sale' | 'system';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    itemId?: mongoose.Types.ObjectId;
    branchId?: mongoose.Types.ObjectId;
    isRead: boolean;
    readBy: mongoose.Types.ObjectId[];
    createdAt: Date;
    expiresAt?: Date;
}

const AlertSchema: Schema = new Schema(
    {
        type: {
            type: String,
            enum: ['low_stock', 'out_of_stock', 'high_value_sale', 'system'],
            required: true,
        },
        severity: {
            type: String,
            enum: ['info', 'warning', 'critical'],
            required: true,
            default: 'info',
        },
        title: {
            type: String,
            required: [true, 'Alert title is required'],
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Alert message is required'],
            trim: true,
        },
        itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
        },
        branchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readBy: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
AlertSchema.index({ type: 1 });
AlertSchema.index({ severity: 1 });
AlertSchema.index({ branchId: 1 });
AlertSchema.index({ isRead: 1 });
AlertSchema.index({ createdAt: -1 });

// Auto-delete expired alerts
AlertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IAlert>('Alert', AlertSchema);
