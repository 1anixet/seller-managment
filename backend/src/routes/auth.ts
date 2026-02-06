import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';
import * as authController from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);

export default router;
