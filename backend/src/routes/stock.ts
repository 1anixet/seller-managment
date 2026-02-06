import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { stockRefillValidation } from '../middleware/validation';
import * as stockController from '../controllers/stockController';

const router = express.Router();

// All routes are protected
router.use(protect);

// Stock management routes
router.post('/refill', authorize('owner', 'manager'), stockRefillValidation, stockController.refillStock);
router.post('/adjust', authorize('owner', 'manager'), stockController.adjustStock);
router.get('/logs', stockController.getStockLogs);

export default router;
