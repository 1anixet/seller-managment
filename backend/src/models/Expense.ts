import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
    category: 'rent' | 'utilities' | 'salaries' | 'supplies' | 'other';
    amount: number;
    description: string;
    date: Date;
    paymentMethod: string;
    reference?: string;
    approvedBy: mongoose.Types.ObjectId;
    branchId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
    {
        category: {
            type: String,
            enum: ['rent', 'utilities', 'salaries', 'supplies', 'other'],
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'cash',
        },
        reference: {
            type: String,
            trim: true,
        },
        approvedBy: {
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
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ branchId: 1 });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
