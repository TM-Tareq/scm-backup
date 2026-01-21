import express from 'express';
import {
    createBlog,
    getAcceptedBlogs,
    getBlogDetails,
    addComment,
    toggleReaction,
    getPendingBlogs,
    updateBlogStatus
} from '../controllers/blog.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAcceptedBlogs);
router.get('/:id', getBlogDetails);

// User routes
router.post('/', verifyToken, createBlog);
router.post('/comment', verifyToken, addComment);
router.post('/react', verifyToken, toggleReaction);

// Admin/Editor routes
router.get('/admin/pending', verifyToken, getPendingBlogs);
router.put('/admin/status', verifyToken, updateBlogStatus);

export default router;
