import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
    name: string;
    sku: string;
    barcode?: string;
    category: mongoose.Types.ObjectId;
    description?: string;
    images: string[];
    pricing: {
        costPrice: number;
        sellingPrice: number;
        margin: number;
        marginPercentage: number;
    };
    stock: {
        quantity: number;
        unit: string;
        lowStockThreshold: number;
        reorderPoint: number;
    };
    tags: string[];
    branchId?: mongoose.Types.ObjectId;
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        barcode: {
            type: String,
            trim: true,
            sparse: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        description: {
            type: String,
            trim: true,
        },
        images: [{
            type: String,
        }],
        pricing: {
            costPrice: {
                type: Number,
                required: [true, 'Cost price is required'],
                min: [0, 'Cost price cannot be negative'],
            },
            sellingPrice: {
                type: Number,
                required: [true, 'Selling price is required'],
                min: [0, 'Selling price cannot be negative'],
            },
            margin: {
                type: Number,
                default: 0,
            },
            marginPercentage: {
                type: Number,
                default: 0,
            },
        },
        stock: {
            quantity: {
                type: Number,
                required: [true, 'Stock quantity is required'],
                min: [0, 'Stock cannot be negative'],
                default: 0,
            },
            unit: {
                type: String,
                required: [true, 'Unit is required'],
                default: 'pcs',
            },
            lowStockThreshold: {
                type: Number,
                default: 10,
                min: [0, 'Threshold cannot be negative'],
            },
            reorderPoint: {
                type: Number,
                default: 5,
                min: [0, 'Reorder point cannot be negative'],
            },
        },
        tags: [{
            type: String,
            trim: true,
        }],
        branchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate margin before saving
ItemSchema.pre('save', function (next) {
    if (this.pricing.sellingPrice && this.pricing.costPrice) {
        this.pricing.margin = this.pricing.sellingPrice - this.pricing.costPrice;
        this.pricing.marginPercentage = ((this.pricing.margin / this.pricing.costPrice) * 100);
    }
    next();
});

// Indexes
ItemSchema.index({ name: 'text' });
ItemSchema.index({ sku: 1 }, { unique: true });
ItemSchema.index({ barcode: 1 }, { sparse: true });
ItemSchema.index({ category: 1 });
ItemSchema.index({ branchId: 1 });
ItemSchema.index({ 'stock.quantity': 1 });
ItemSchema.index({ isActive: 1 });

export default mongoose.model<IItem>('Item', ItemSchema);
