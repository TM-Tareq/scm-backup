import express from 'express';
import { createOrder, getUserOrders, getOrderDetails, getVendorOrders } from '../controllers/order.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/vendor/all', verifyToken, authorizeRole('vendor'), getVendorOrders);
router.get('/:id', verifyToken, getOrderDetails);


export default router;
