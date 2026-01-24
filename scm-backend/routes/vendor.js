import express from 'express';
import {
    createProfile,
    getDashboardStats,
    getVendorStatus,
    requestVendorApproval,
    getVendorAnalytics,
    getPayouts,
    requestPayout
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
router.get('/analytics', verifyToken, authorizeRole('vendor'), getVendorAnalytics);

// Payouts
router.get('/payouts', verifyToken, authorizeRole('vendor'), getPayouts);
router.post('/payouts', verifyToken, authorizeRole('vendor'), requestPayout);


export default router;
