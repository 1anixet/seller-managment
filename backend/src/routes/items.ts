import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { itemValidation } from '../middleware/validation';
import { upload } from '../middleware/upload';
import * as itemController from '../controllers/itemController';

const router = express.Router();

// All routes are protected
router.use(protect);

// Item CRUD
router.get('/', itemController.getAllItems);
router.get('/low-stock', itemController.getLowStockItems);
router.get('/:id', itemController.getItemById);
router.post('/', authorize('owner', 'manager'), itemValidation, itemController.createItem);
router.put('/:id', authorize('owner', 'manager'), itemController.updateItem);
router.delete('/:id', authorize('owner', 'manager'), itemController.deleteItem);

// Image upload
router.post('/upload-image', authorize('owner', 'manager'), upload.single('image'), itemController.uploadImage);

export default router;
