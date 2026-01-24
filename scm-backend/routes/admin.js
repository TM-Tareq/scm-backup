import express from 'express';
import {
    getPendingVendors, approveVendor, rejectVendor, getAllVendors,
    getCommissions, setCommissionRate,
    getPayouts, updatePayoutStatus,
    getCarriers, addCarrier, updateCarrier, deleteCarrier,
    getFAQs, addFAQ,
    getAnnouncements, addAnnouncement,
    getAuditLogs, getPlatformAnalytics,
    getEditors, addEditor, updateEditorStatus, deleteEditor,
    getUsersWithAnalytics, getUserOrderHistory
} from '../controllers/admin.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';
import { auditLog } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.get('/vendors/pending', verifyToken, authorizeRole('admin'), getPendingVendors);
router.get('/vendors', verifyToken, authorizeRole('admin'), getAllVendors);
router.post('/vendors/approve', verifyToken, authorizeRole('admin'), auditLog('approve', 'vendor'), approveVendor);
router.post('/vendors/reject', verifyToken, authorizeRole('admin'), auditLog('reject', 'vendor'), rejectVendor);

// Commissions
router.get('/commissions', verifyToken, authorizeRole('admin'), getCommissions);
router.post('/commissions', verifyToken, authorizeRole('admin'), auditLog('set_rate', 'commission'), setCommissionRate);

// Payouts
router.get('/payouts', verifyToken, authorizeRole('admin'), getPayouts);
router.put('/payouts/status', verifyToken, authorizeRole('admin'), auditLog('update_status', 'payout'), updatePayoutStatus);

// Carriers
router.get('/carriers', verifyToken, authorizeRole('admin'), getCarriers);
router.post('/carriers', verifyToken, authorizeRole('admin'), auditLog('add', 'carrier'), addCarrier);
router.put('/carriers/:id', verifyToken, authorizeRole('admin'), auditLog('edit', 'carrier'), updateCarrier);
router.delete('/carriers/:id', verifyToken, authorizeRole('admin'), auditLog('delete', 'carrier'), deleteCarrier);

// FAQs & Announcements
router.get('/faqs', verifyToken, authorizeRole('admin'), getFAQs);
router.post('/faqs', verifyToken, authorizeRole('admin'), auditLog('create', 'faq'), addFAQ);
router.get('/announcements', verifyToken, authorizeRole('admin'), getAnnouncements);
router.post('/announcements', verifyToken, authorizeRole('admin'), auditLog('create', 'announcement'), addAnnouncement);

// Audit & Analytics
router.get('/audit-logs', verifyToken, authorizeRole('admin'), getAuditLogs);
router.get('/analytics', verifyToken, authorizeRole('admin'), getPlatformAnalytics);

// Editors
router.get('/editors', verifyToken, authorizeRole('admin'), getEditors);
router.post('/add-editor', verifyToken, authorizeRole('admin'), auditLog('create', 'editor'), addEditor);
router.put('/editors/status', verifyToken, authorizeRole('admin'), auditLog('update_status', 'editor'), updateEditorStatus);
router.delete('/editors/:id', verifyToken, authorizeRole('admin'), auditLog('delete', 'editor'), deleteEditor);

// Users detail
router.get('/users/analytics', verifyToken, authorizeRole('admin'), getUsersWithAnalytics);
router.get('/users/:userId/orders', verifyToken, authorizeRole('admin'), getUserOrderHistory);

export default router;
