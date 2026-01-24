import express from 'express';
import {
    createShipment,
    getShipmentDetails,
    assignDeliveryPerson,
    updateShipmentStatus,
    getAllShipments,
    getDeliveryPersonShipments
} from '../controllers/shipment.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/', verifyToken, authorizeRole('admin'), createShipment);
router.get('/', verifyToken, authorizeRole('admin'), getAllShipments);
router.get('/:id', verifyToken, authorizeRole('admin'), getShipmentDetails);
router.post('/assign', verifyToken, authorizeRole('admin'), assignDeliveryPerson);
router.put('/status', verifyToken, authorizeRole('admin'), updateShipmentStatus);

// Delivery person routes
router.get('/delivery/my-shipments', verifyToken, getDeliveryPersonShipments);

export default router;
