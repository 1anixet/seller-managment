import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Item from '../models/Item';
import Alert from '../models/Alert';
import { AuthRequest } from '../middleware/auth';
import { slugify, generateSKU } from '../utils/helpers';

export const getAllItems = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { search, category, isActive, page = 1, limit = 20, sort = '-createdAt' } = req.query;

        const query: any = {};

        // Branch filter (non-owners only see their branch)
        if (req.user.role !== 'owner' && req.user.branchId) {
            query.branchId = req.user.branchId;
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { barcode: { $regex: search, $options: 'i' } },
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Active filter
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const skip = (Number(page) - 1) * Number(limit);

        const items = await Item.find(query)
            .populate('category', 'name slug')
            .populate('createdBy', 'username')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit));

        const total = await Item.countDocuments(query);

        res.status(200).json({
            success: true,
            data: items,
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

export const getItemById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('category', 'name slug color icon')
            .populate('createdBy', 'username profile');

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

export const createItem = async (
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

        const itemData = {
            ...req.body,
            createdBy: req.userId,
            branchId: req.user.role === 'owner' ? req.body.branchId : req.user.branchId,
        };

        // Generate SKU if not provided
        if (!itemData.sku) {
            const category = await Item.findById(itemData.category).select('name');
            itemData.sku = generateSKU(itemData.name, category?.name || 'ITEM');
        }

        const item = await Item.create(itemData);

        // Check if stock is low and create alert
        if (item.stock.quantity <= item.stock.lowStockThreshold) {
            await Alert.create({
                type: item.stock.quantity === 0 ? 'out_of_stock' : 'low_stock',
                severity: item.stock.quantity === 0 ? 'critical' : 'warning',
                title: `${item.stock.quantity === 0 ? 'Out of Stock' : 'Low Stock'}: ${item.name}`,
                message: `${item.name} has ${item.stock.quantity} ${item.stock.unit} remaining`,
                itemId: item._id,
                branchId: item.branchId,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found',
            });
            return;
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found',
            });
            return;
        }

        // Soft delete by setting isActive to false
        item.isActive = false;
        await item.save();

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getLowStockItems = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const query: any = {
            isActive: true,
            $expr: {
                $lte: ['$stock.quantity', '$stock.lowStockThreshold'],
            },
        };

        if (req.user.role !== 'owner' && req.user.branchId) {
            query.branchId = req.user.branchId;
        }

        const items = await Item.find(query)
            .populate('category', 'name')
            .sort('stock.quantity');

        res.status(200).json({
            success: true,
            data: items,
        });
    } catch (error) {
        next(error);
    }
};

export const uploadImage = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
            return;
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: { url: imageUrl },
        });
    } catch (error) {
        next(error);
    }
};
