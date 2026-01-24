import express from 'express';
const router = express.Router();
import * as warehouseController from '../controllers/warehouse.controller.js';

import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

// CRUD for Warehouses
router.get('/', verifyToken, warehouseController.getAllWarehouses);
router.get('/:id', verifyToken, warehouseController.getWarehouseById);
router.post('/', verifyToken, authorizeRole('admin'), warehouseController.createWarehouse);
router.put('/:id', verifyToken, authorizeRole('admin'), warehouseController.updateWarehouse);
router.delete('/:id', verifyToken, authorizeRole('admin'), warehouseController.deleteWarehouse);

// Inventory Management
router.get('/:id/inventory', verifyToken, warehouseController.getWarehouseInventory);
router.post('/stock', verifyToken, authorizeRole('admin'), warehouseController.updateStock);

export default router;
