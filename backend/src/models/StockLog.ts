import mongoose, { Schema, Document } from 'mongoose';

export interface IStockLog extends Document {
    itemId: mongoose.Types.ObjectId;
    type: 'purchase' | 'sale' | 'adjustment' | 'return';
    quantity: number;
    previousQuantity: number;
    newQuantity: number;
    costPrice?: number;
    supplier?: mongoose.Types.ObjectId;
    reason?: string;
    reference?: string;
    performedBy: mongoose.Types.ObjectId;
    branchId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const StockLogSchema: Schema = new Schema(
    {
        itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        type: {
            type: String,
            enum: ['purchase', 'sale', 'adjustment', 'return'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        previousQuantity: {
            type: Number,
            required: true,
        },
        newQuantity: {
            type: Number,
            required: true,
        },
        costPrice: {
            type: Number,
            min: [0, 'Cost price cannot be negative'],
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
        },
        reason: {
            type: String,
            trim: true,
        },
        reference: {
            type: String,
            trim: true,
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        branchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
StockLogSchema.index({ itemId: 1 });
StockLogSchema.index({ type: 1 });
StockLogSchema.index({ createdAt: -1 });
StockLogSchema.index({ branchId: 1 });
StockLogSchema.index({ performedBy: 1 });

export default mongoose.model<IStockLog>('StockLog', StockLogSchema);
