import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth';
import User from '../models/User';

export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Check for token in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
            return;
        }

        // Verify token
        const decoded = verifyAccessToken(token);
        req.userId = decoded.userId;

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: 'User account is inactive',
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
            return;
        }

        next();
    };
};

export const checkBranchAccess = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
        return;
    }

    // Owners can access all branches
    if (req.user.role === 'owner') {
        next();
        return;
    }

    // Other roles can only access their own branch
    const requestedBranchId = req.body.branchId || req.query.branchId || req.params.branchId;

    if (requestedBranchId && requestedBranchId !== req.user.branchId?.toString()) {
        res.status(403).json({
            success: false,
            message: 'Not authorized to access this branch',
        });
        return;
    }

    next();
};
