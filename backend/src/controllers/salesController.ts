import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Sale from '../models/Sale';
import Item from '../models/Item';
import StockLog from '../models/StockLog';
import Alert from '../models/Alert';
import { AuthRequest } from '../middleware/auth';
import { generateInvoiceNumber } from '../utils/helpers';

export const createSale = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await session.abortTransaction();
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { items, payment, customer, totals } = req.body;

        // Validate and calculate totals
        let calculatedSubtotal = 0;
        let calculatedProfit = 0;
        const processedItems = [];

        for (const saleItem of items) {
            const item = await Item.findById(saleItem.itemId).session(session);

            if (!item) {
                await session.abortTransaction();
                res.status(404).json({
                    success: false,
                    message: `Item ${saleItem.itemId} not found`,
                });
                return;
            }

            if (!item.isActive) {
                await session.abortTransaction();
                res.status(400).json({
                    success: false,
                    message: `Item ${item.name} is not active`,
                });
                return;
            }

            if (item.stock.quantity < saleItem.quantity) {
                await session.abortTransaction();
                res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}. Available: ${item.stock.quantity}`,
                });
                return;
            }

            const itemSubtotal = item.pricing.sellingPrice * saleItem.quantity;
            const itemProfit = (item.pricing.sellingPrice - item.pricing.costPrice) * saleItem.quantity;

            processedItems.push({
                itemId: item._id,
                name: item.name,
                quantity: saleItem.quantity,
                costPrice: item.pricing.costPrice,
                sellingPrice: item.pricing.sellingPrice,
                subtotal: itemSubtotal,
                profit: itemProfit,
            });

            calculatedSubtotal += itemSubtotal;
            calculatedProfit += itemProfit;

            // Update stock
            const previousQuantity = item.stock.quantity;
            item.stock.quantity -= saleItem.quantity;
            await item.save({ session });

            // Create stock log
            await StockLog.create([{
                itemId: item._id,
                type: 'sale',
                quantity: -saleItem.quantity,
                previousQuantity,
                newQuantity: item.stock.quantity,
                performedBy: req.userId,
                branchId: item.branchId,
            }], { session });

            // Check if stock is now low and create alert
            if (item.stock.quantity <= item.stock.lowStockThreshold && previousQuantity > item.stock.lowStockThreshold) {
                await Alert.create([{
                    type: item.stock.quantity === 0 ? 'out_of_stock' : 'low_stock',
                    severity: item.stock.quantity === 0 ? 'critical' : 'warning',
                    title: `${item.stock.quantity === 0 ? 'Out of Stock' : 'Low Stock'}: ${item.name}`,
                    message: `${item.name} now has ${item.stock.quantity} ${item.stock.unit} remaining`,
                    itemId: item._id,
                    branchId: item.branchId,
                }], { session });
            }
        }

        // Calculate final total
        const calculatedTotal = calculatedSubtotal + (totals?.tax || 0) - (totals?.discount || 0);

        // Create sale
        const sale = await Sale.create([{
            invoiceNumber: generateInvoiceNumber(),
            items: processedItems,
            totals: {
                subtotal: calculatedSubtotal,
                tax: totals?.tax || 0,
                discount: totals?.discount || 0,
                total: calculatedTotal,
                profit: calculatedProfit,
            },
            payment: {
                method: payment.method,
                amountPaid: payment.amountPaid,
                change: payment.amountPaid - calculatedTotal,
            },
            customer,
            cashier: req.userId,
            branchId: req.user.role === 'owner' ? req.body.branchId : req.user.branchId,
            status: 'completed',
        }], { session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Sale completed successfully',
            data: sale[0],
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const getAllSales = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { startDate, endDate, status, cashier, page = 1, limit = 20 } = req.query;

        const query: any = {};

        // Branch filter
        if (req.user.role !== 'owner' && req.user.branchId) {
            query.branchId = req.user.branchId;
        }

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate as string);
            if (endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Cashier filter
        if (cashier) {
            query.cashier = cashier;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const sales = await Sale.find(query)
            .populate('cashier', 'username profile')
            .populate('items.itemId', 'name')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await Sale.countDocuments(query);

        res.status(200).json({
            success: true,
            data: sales,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getSaleById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('cashier', 'username profile')
            .populate('items.itemId', 'name sku');

        if (!sale) {
            res.status(404).json({
                success: false,
                message: 'Sale not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

export const getSalesStats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const query: any = { status: 'completed' };

        if (req.user.role !== 'owner' && req.user.branchId) {
            query.branchId = req.user.branchId;
        }

        // Today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySales = await Sale.aggregate([
            { $match: { ...query, createdAt: { $gte: today } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totals.total' },
                    totalProfit: { $sum: '$totals.profit' },
                    count: { $sum: 1 },
                },
            },
        ]);

        // This week's stats
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weeklySales = await Sale.aggregate([
            { $match: { ...query, createdAt: { $gte: weekStart } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totals.total' },
                    totalProfit: { $sum: '$totals.profit' },
                    count: { $sum: 1 },
                },
            },
        ]);

        // This month's stats
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const monthlySales = await Sale.aggregate([
            { $match: { ...query, createdAt: { $gte: monthStart } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totals.total' },
                    totalProfit: { $sum: '$totals.profit' },
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                today: todaySales[0] || { totalSales: 0, totalProfit: 0, count: 0 },
                week: weeklySales[0] || { totalSales: 0, totalProfit: 0, count: 0 },
                month: monthlySales[0] || { totalSales: 0, totalProfit: 0, count: 0 },
            },
        });
    } catch (error) {
        next(error);
    }
};
