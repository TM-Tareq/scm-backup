import express from 'express';
import {
    getTrackingByCode,
    updateGPSLocation,
    getLocationHistory,
    savePlannedRoute,
    getVendorShipments
} from '../controllers/tracking.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public tracking endpoint (no auth required)
router.get('/:code', getTrackingByCode);

// GPS location update (from IoT device)
router.post('/location', updateGPSLocation);

// Location history
router.get('/shipment/:shipmentId/history', getLocationHistory);

// Save planned route
router.post('/route/planned', verifyToken, authorizeRole('admin'), savePlannedRoute);

// Vendor tracking
router.get('/vendor/shipments', verifyToken, authorizeRole('vendor'), getVendorShipments);

export default router;
