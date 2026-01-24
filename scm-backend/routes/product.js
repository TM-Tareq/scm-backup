import express from 'express';
import { getAllProducts, getProductById, getVendorProducts, createProduct, deleteProduct, updateProduct } from '../controllers/product.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Vendor Routes
router.get('/vendor/all', verifyToken, authorizeRole('vendor'), getVendorProducts);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, authorizeRole('vendor'), upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, authorizeRole('vendor'), upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, authorizeRole('vendor'), deleteProduct);

export default router;
