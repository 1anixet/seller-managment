import { body, param, query, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body('profile.firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),
    body('profile.lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),
];

export const loginValidation: ValidationChain[] = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const itemValidation: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Item name is required'),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('pricing.costPrice')
        .isFloat({ min: 0 })
        .withMessage('Cost price must be a positive number'),
    body('pricing.sellingPrice')
        .isFloat({ min: 0 })
        .withMessage('Selling price must be a positive number'),
    body('stock.quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer'),
    body('stock.lowStockThreshold')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Low stock threshold must be a non-negative integer'),
];

export const categoryValidation: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required'),
    body('slug')
        .optional()
        .trim()
        .isSlug()
        .withMessage('Slug must be URL-friendly'),
];

export const saleValidation: ValidationChain[] = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('At least one item is required'),
    body('items.*.itemId')
        .isMongoId()
        .withMessage('Invalid item ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('payment.method')
        .isIn(['cash', 'card', 'upi', 'other'])
        .withMessage('Invalid payment method'),
    body('payment.amountPaid')
        .isFloat({ min: 0 })
        .withMessage('Amount paid must be a positive number'),
];

export const stockRefillValidation: ValidationChain[] = [
    body('itemId')
        .isMongoId()
        .withMessage('Invalid item ID'),
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('costPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Cost price must be a positive number'),
];

export const expenseValidation: ValidationChain[] = [
    body('category')
        .isIn(['rent', 'utilities', 'salaries', 'supplies', 'other'])
        .withMessage('Invalid expense category'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
];
