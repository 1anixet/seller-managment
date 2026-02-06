import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
    invoiceNumber: string;
    items: Array<{
        itemId: mongoose.Types.ObjectId;
        name: string;
        quantity: number;
        costPrice: number;
        sellingPrice: number;
        subtotal: number;
        profit: number;
    }>;
    totals: {
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        profit: number;
    };
    payment: {
        method: 'cash' | 'card' | 'upi' | 'other';
        amountPaid: number;
        change: number;
    };
    customer?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    cashier: mongoose.Types.ObjectId;
    branchId?: mongoose.Types.ObjectId;
    status: 'completed' | 'cancelled' | 'refunded';
    createdAt: Date;
    updatedAt: Date;
}

const SaleSchema: Schema = new Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [{
            itemId: {
                type: Schema.Types.ObjectId,
                ref: 'Item',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1'],
            },
            costPrice: {
                type: Number,
                required: true,
                min: [0, 'Cost price cannot be negative'],
            },
            sellingPrice: {
                type: Number,
                required: true,
                min: [0, 'Selling price cannot be negative'],
            },
            subtotal: {
                type: Number,
                required: true,
            },
            profit: {
                type: Number,
                required: true,
            },
        }],
        totals: {
            subtotal: {
                type: Number,
                required: true,
                min: [0, 'Subtotal cannot be negative'],
            },
            tax: {
                type: Number,
                default: 0,
                min: [0, 'Tax cannot be negative'],
            },
            discount: {
                type: Number,
                default: 0,
                min: [0, 'Discount cannot be negative'],
            },
            total: {
                type: Number,
                required: true,
                min: [0, 'Total cannot be negative'],
            },
            profit: {
                type: Number,
                required: true,
            },
        },
        payment: {
            method: {
                type: String,
                enum: ['cash', 'card', 'upi', 'other'],
                required: true,
                default: 'cash',
            },
            amountPaid: {
                type: Number,
                required: true,
                min: [0, 'Amount paid cannot be negative'],
            },
            change: {
                type: Number,
                default: 0,
                min: [0, 'Change cannot be negative'],
            },
        },
        customer: {
            name: String,
            phone: String,
            email: String,
        },
        cashier: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        branchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
        status: {
            type: String,
            enum: ['completed', 'cancelled', 'refunded'],
            default: 'completed',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
SaleSchema.index({ invoiceNumber: 1 }, { unique: true });
SaleSchema.index({ createdAt: -1 });
SaleSchema.index({ branchId: 1 });
SaleSchema.index({ cashier: 1 });
SaleSchema.index({ status: 1 });
SaleSchema.index({ 'items.itemId': 1 });

export default mongoose.model<ISale>('Sale', SaleSchema);
