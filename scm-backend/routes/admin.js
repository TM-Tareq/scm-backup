import express from 'express';
import {
    getPendingVendors, approveVendor, rejectVendor, getAllVendors,
    getCommissions, setCommissionRate,
    getPayouts, updatePayoutStatus,
    getCarriers, addCarrier,
    getFAQs, addFAQ,
    getAnnouncements, addAnnouncement,
    getAuditLogs, getPlatformAnalytics,
    getEditors, updateEditorStatus, deleteEditor,
    getUsersWithAnalytics, getUserOrderHistory
} from '../controllers/admin.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/vendors/pending', verifyToken, authorizeRole('admin'), getPendingVendors);
router.get('/vendors', verifyToken, authorizeRole('admin'), getAllVendors);
router.post('/vendors/approve', verifyToken, authorizeRole('admin'), approveVendor);
router.post('/vendors/reject', verifyToken, authorizeRole('admin'), rejectVendor);

// Commissions
router.get('/commissions', verifyToken, authorizeRole('admin'), getCommissions);
router.post('/commissions', verifyToken, authorizeRole('admin'), setCommissionRate);

// Payouts
router.get('/payouts', verifyToken, authorizeRole('admin'), getPayouts);
router.put('/payouts/status', verifyToken, authorizeRole('admin'), updatePayoutStatus);

// Carriers
router.get('/carriers', verifyToken, authorizeRole('admin'), getCarriers);
router.post('/carriers', verifyToken, authorizeRole('admin'), addCarrier);

// FAQs & Announcements
router.get('/faqs', verifyToken, authorizeRole('admin'), getFAQs);
router.post('/faqs', verifyToken, authorizeRole('admin'), addFAQ);
router.get('/announcements', verifyToken, authorizeRole('admin'), getAnnouncements);
router.post('/announcements', verifyToken, authorizeRole('admin'), addAnnouncement);

// Audit & Analytics
router.get('/audit-logs', verifyToken, authorizeRole('admin'), getAuditLogs);
router.get('/analytics', verifyToken, authorizeRole('admin'), getPlatformAnalytics);

// Editors
router.get('/editors', verifyToken, authorizeRole('admin'), getEditors);
router.put('/editors/status', verifyToken, authorizeRole('admin'), updateEditorStatus);
router.delete('/editors/:id', verifyToken, authorizeRole('admin'), deleteEditor);

// Users detail
router.get('/users/analytics', verifyToken, authorizeRole('admin'), getUsersWithAnalytics);
router.get('/users/:userId/orders', verifyToken, authorizeRole('admin'), getUserOrderHistory);

export default router;
