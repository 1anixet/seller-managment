import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import Category from '../models/Category';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const categories = await Category.find().sort('name');

        res.json({
            success: true,
            data: categories,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Manager, Owner)
router.post(
    '/',
    protect,
    authorize('owner', 'manager'),
    [
        body('name').trim().notEmpty().withMessage('Category name is required'),
        body('slug').optional().trim(),
        validate,
    ],
    async (req, res) => {
        try {
            const { name, description, icon, color } = req.body;

            // Generate slug from name if not provided
            const slug = req.body.slug || name.toLowerCase().replace(/\s+/g, '-');

            // Check if category with same slug exists
            const existing = await Category.findOne({ slug });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists',
                });
            }

            const category = await Category.create({
                name,
                slug,
                description,
                icon,
                color,
            });

            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Manager, Owner)
router.put(
    '/:id',
    protect,
    authorize('owner', 'manager'),
    async (req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }

            res.json({
                success: true,
                data: category,
                message: 'Category updated successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Owner)
router.delete(
    '/:id',
    protect,
    authorize('owner'),
    async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }

            res.json({
                success: true,
                message: 'Category deleted successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

export default router;
