import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    parent?: mongoose.Types.ObjectId;
    icon?: string;
    color?: string;
    branchId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        icon: {
            type: String,
        },
        color: {
            type: String,
            default: '#3B82F6',
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
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ branchId: 1 });
CategorySchema.index({ parent: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema);
