import express from 'express';
import {
    registerDevice,
    assignDevice,
    getDeviceStatus,
    getAllDevices,
    updateDeviceStatus,
    getMyDevice
} from '../controllers/iot-device.controller.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/register', verifyToken, authorizeRole('admin'), registerDevice);
router.post('/assign', verifyToken, authorizeRole('admin'), assignDevice);
router.get('/', verifyToken, authorizeRole('admin'), getAllDevices);
router.get('/:deviceId', verifyToken, authorizeRole('admin'), getDeviceStatus);
router.put('/status', verifyToken, authorizeRole('admin'), updateDeviceStatus);

// Delivery person routes
router.get('/my/device', verifyToken, getMyDevice);

export default router;
