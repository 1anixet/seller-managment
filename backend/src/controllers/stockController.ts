import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Item from '../models/Item';
import StockLog from '../models/StockLog';
import { AuthRequest } from '../middleware/auth';

export const refillStock = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { itemId, quantity, costPrice, supplier, reason } = req.body;

        const item = await Item.findById(itemId);

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found',
            });
            return;
        }

        const previousQuantity = item.stock.quantity;
        item.stock.quantity += quantity;

        // Update cost price if provided
        if (costPrice) {
            item.pricing.costPrice = costPrice;
        }

        await item.save();

        // Create stock log
        const stockLog = await StockLog.create({
            itemId: item._id,
            type: 'purchase',
            quantity,
            previousQuantity,
            newQuantity: item.stock.quantity,
            costPrice: costPrice || item.pricing.costPrice,
            supplier,
            reason,
            performedBy: req.userId,
            branchId: item.branchId,
        });

        res.status(200).json({
            success: true,
            message: 'Stock refilled successfully',
            data: {
                item,
                stockLog,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getStockLogs = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { itemId, type, startDate, endDate, page = 1, limit = 50 } = req.query;

        const query: any = {};

        // Branch filter
        if (req.user.role !== 'owner' && req.user.branchId) {
            query.branchId = req.user.branchId;
        }

        // Item filter
        if (itemId) {
            query.itemId = itemId;
        }

        // Type filter
        if (type) {
            query.type = type;
        }

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate as string);
            if (endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const logs = await StockLog.find(query)
            .populate('itemId', 'name sku')
            .populate('performedBy', 'username profile')
            .populate('supplier', 'name')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await StockLog.countDocuments(query);

        res.status(200).json({
            success: true,
            data: logs,
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

export const adjustStock = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { itemId, newQuantity, reason } = req.body;

        const item = await Item.findById(itemId);

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found',
            });
            return;
        }

        const previousQuantity = item.stock.quantity;
        const quantityChange = newQuantity - previousQuantity;

        item.stock.quantity = newQuantity;
        await item.save();

        // Create stock log
        await StockLog.create({
            itemId: item._id,
            type: 'adjustment',
            quantity: quantityChange,
            previousQuantity,
            newQuantity,
            reason: reason || 'Manual adjustment',
            performedBy: req.userId,
            branchId: item.branchId,
        });

        res.status(200).json({
            success: true,
            message: 'Stock adjusted successfully',
            data: item,
        });
    } catch (error) {
        next(error);
    }
};
