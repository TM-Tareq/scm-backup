import express from 'express';
import { addReview, getProductReviews } from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', verifyToken, addReview);
router.get('/:productId', getProductReviews);

export default router;
