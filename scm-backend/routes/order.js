import express from 'express';
import { createOrder, getUserOrders, getOrderDetails } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/:id', verifyToken, getOrderDetails);

export default router;
