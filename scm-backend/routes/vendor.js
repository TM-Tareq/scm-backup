import express from 'express';
import {
    createProfile,
    getDashboardStats,
    getVendorStatus,
    requestVendorApproval
} from '../controllers/vendor.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create / update vendor profile (acts as initial verification request)
router.post('/register', verifyToken, authorizeRole('vendor', 'customer'), createProfile);

// Vendor status helpers
router.get('/status', verifyToken, authorizeRole('vendor', 'customer'), getVendorStatus);
router.post('/request-approval', verifyToken, authorizeRole('vendor', 'customer'), requestVendorApproval);

// Dashboard data (only for approved vendors)
router.get('/dashboard', verifyToken, authorizeRole('vendor'), getDashboardStats);

export default router;
