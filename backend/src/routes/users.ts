import express from 'express';
import { protect, authorize } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users  
// @access  Private (Owner, Manager)
router.get('/', protect, authorize('owner', 'manager'), async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('branchId', 'name code')
            .sort('-createdAt');

        res.json({
            success: true,
            data: users,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Owner, Manager)
router.get('/:id', protect, authorize('owner', 'manager'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('branchId', 'name code');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Owner)
router.put('/:id', protect, authorize('owner'), async (req, res) => {
    try {
        const { role, isActive, profile, branchId } = req.body;

        const updateData: any = {};
        if (role) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (profile) updateData.profile = profile;
        if (branchId) updateData.branchId = branchId;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
            message: 'User updated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete - set inactive)
// @access  Private (Owner)
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            message: 'User deactivated successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
