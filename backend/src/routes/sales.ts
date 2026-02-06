import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { saleValidation } from '../middleware/validation';
import * as salesController from '../controllers/salesController';

const router = express.Router();

// All routes are protected
router.use(protect);

// Sales routes
router.post('/', saleValidation, salesController.createSale);
router.get('/', salesController.getAllSales);
router.get('/stats', salesController.getSalesStats);
router.get('/:id', salesController.getSaleById);

export default router;
