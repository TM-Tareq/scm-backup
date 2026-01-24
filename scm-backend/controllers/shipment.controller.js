import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

// Generate unique tracking code
const generateTrackingCode = () => {
    const year = new Date().getFullYear();
    const random = uuidv4().split('-')[0].toUpperCase();
    return `TRK-${year}-${random}`;
};

// Generate unique product tracking code for vendor
const generateProductTrackingCode = () => {
    return `PTK-${uuidv4().split('-').join('').toUpperCase().substring(0, 12)}`;
};

// Create shipment from order
export const createShipment = async (req, res) => {
    const { orderId, warehouseId, carrierId, deliveryPersonId } = req.body;

    try {
        const trackingCode = generateTrackingCode();

        // Get order details
        const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create shipment
        const [result] = await db.query(
            `INSERT INTO shipments (tracking_code, order_id, warehouse_id, carrier_id, delivery_person_id, status)
             VALUES (?, ?, ?, ?, ?, 'preparing')`,
            [trackingCode, orderId, warehouseId, carrierId || null, deliveryPersonId || null]
        );

        const shipmentId = result.insertId;

        // Get order items with vendor info
        const [orderItems] = await db.query(`
            SELECT oi.*, p.vendor_id 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [orderId]);

        // Create unique tracking codes for each product (for vendor tracking)
        for (const item of orderItems) {
            const uniqueCode = generateProductTrackingCode();
            await db.query(
                `INSERT INTO tracking_codes (shipment_id, product_id, vendor_id, unique_code, quantity)
                 VALUES (?, ?, ?, ?, ?)`,
                [shipmentId, item.product_id, item.vendor_id, uniqueCode, item.quantity]
            );
        }

        res.status(201).json({
            message: 'Shipment created successfully',
            shipmentId,
            trackingCode
        });
    } catch (err) {
        console.error('Create shipment error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get shipment details
export const getShipmentDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const [shipment] = await db.query(`
            SELECT s.*, w.name as warehouse_name, w.address as warehouse_address,
                   c.name as carrier_name, u.fname as delivery_person_fname, u.lname as delivery_person_lname
            FROM shipments s
            LEFT JOIN warehouses w ON s.warehouse_id = w.id
            LEFT JOIN carriers c ON s.carrier_id = c.id
            LEFT JOIN users u ON s.delivery_person_id = u.id
            WHERE s.id = ?
        `, [id]);

        if (shipment.length === 0) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        res.json(shipment[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Assign delivery person
export const assignDeliveryPerson = async (req, res) => {
    const { shipmentId, deliveryPersonId, deviceId } = req.body;

    try {
        await db.query(
            'UPDATE shipments SET delivery_person_id = ?, status = ? WHERE id = ?',
            [deliveryPersonId, 'ready_to_ship', shipmentId]
        );

        // Link device to delivery person if provided
        if (deviceId) {
            await db.query(
                'UPDATE iot_devices SET assigned_to = ? WHERE device_id = ?',
                [deliveryPersonId, deviceId]
            );
        }

        res.json({ message: 'Delivery person assigned successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update shipment status
// Update shipment status
export const updateShipmentStatus = async (req, res) => {
    const { shipmentId, status, notes } = req.body;

    try {
        // Get tracking code first for socket room
        const [shipment] = await db.query('SELECT tracking_code FROM shipments WHERE id = ?', [shipmentId]);

        const updates = { status };

        if (status === 'delivered') {
            updates.actual_delivery = new Date();
        }

        if (notes) {
            updates.delivery_notes = notes;
        }

        await db.query(
            'UPDATE shipments SET status = ?, delivery_notes = ?, actual_delivery = ? WHERE id = ?',
            [status, notes || null, updates.actual_delivery || null, shipmentId]
        );

        // Real-time notification
        const io = req.app.get('io');
        if (io && shipment.length > 0) {
            const trackingCode = shipment[0].tracking_code;

            // Notify specific tracking room (Client)
            io.to(`shipment:${trackingCode}`).emit('status:update', {
                status,
                timestamp: new Date(),
                notes
            });

            // Notify Admin Dashboard
            io.emit('shipment:update', {
                id: shipmentId,
                status,
                trackingCode
            });
        }

        res.json({ message: 'Shipment status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all shipments (admin)
export const getAllShipments = async (req, res) => {
    const { status } = req.query;

    try {
        let query = `
            SELECT s.*, o.user_id, w.name as warehouse_name,
                   u.fname as delivery_person_fname, u.lname as delivery_person_lname
            FROM shipments s
            JOIN orders o ON s.order_id = o.id
            LEFT JOIN warehouses w ON s.warehouse_id = w.id
            LEFT JOIN users u ON s.delivery_person_id = u.id
        `;

        const params = [];
        if (status) {
            query += ' WHERE s.status = ?';
            params.push(status);
        }

        query += ' ORDER BY s.created_at DESC';

        const [shipments] = await db.query(query, params);
        res.json(shipments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get active shipments for delivery person
export const getDeliveryPersonShipments = async (req, res) => {
    const deliveryPersonId = req.user.id;

    try {
        const [shipments] = await db.query(`
            SELECT s.*, o.user_id, w.name as warehouse_name, w.address as warehouse_address
            FROM shipments s
            JOIN orders o ON s.order_id = o.id
            LEFT JOIN warehouses w ON s.warehouse_id = w.id
            WHERE s.delivery_person_id = ? AND s.status IN ('ready_to_ship', 'picked_up', 'in_transit', 'out_for_delivery')
            ORDER BY s.created_at DESC
        `, [deliveryPersonId]);

        res.json(shipments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
