import express from 'express';
import { createBlog, getPendingBlogs, updateBlogStatus, getAllBlogs, getBlogById, reactToBlog, addComment, getComments } from '../controllers/blog.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import { auditLog } from '../middleware/auditMiddleware.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err) {
        console.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        if (err.message === 'Images Only!') {
            return res.status(400).json({ message: 'Only image files are allowed (JPEG, JPG, PNG, GIF).' });
        }
        return res.status(400).json({ message: 'File upload error', error: err.message });
    }
    next();
};

// Admin Routes - MUST come before parameterized routes
router.get('/admin/pending', verifyToken, authorizeRole('admin'), getPendingBlogs);
router.put('/admin/status', verifyToken, authorizeRole('admin'), auditLog('moderate', 'blog'), updateBlogStatus);

// Public Routes
router.get('/', getAllBlogs);
router.get('/:blogId/comments', getComments);
router.get('/:id', getBlogById);

// Protected (Any user can post, Admin moderates)
router.post('/', verifyToken, upload.array('images', 5), handleMulterError, createBlog);
router.post('/react', verifyToken, reactToBlog);
router.post('/comment', verifyToken, addComment);

export default router;
