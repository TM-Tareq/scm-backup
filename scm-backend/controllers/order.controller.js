import db from '../db.js';
import fs from 'fs';

export const createOrder = async (req, res) => {
    const { items, totalPrice, shippingDetails, paymentMethod } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'User authentication failed' });
    }

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Ensure orders table has required columns (add if missing)
        try {
            await connection.query(`
                ALTER TABLE orders 
                ADD COLUMN IF NOT EXISTS shipping_address VARCHAR(255),
                ADD COLUMN IF NOT EXISTS city VARCHAR(100),
                ADD COLUMN IF NOT EXISTS state VARCHAR(100),
                ADD COLUMN IF NOT EXISTS zip VARCHAR(20),
                ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(100),
                ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)
            `);
        } catch (alterErr) {
            // MySQL doesn't support IF NOT EXISTS for ALTER TABLE, so we'll try individual columns
            const columnsToAdd = [
                { name: 'shipping_address', def: 'VARCHAR(255)' },
                { name: 'city', def: 'VARCHAR(100)' },
                { name: 'state', def: 'VARCHAR(100)' },
                { name: 'zip', def: 'VARCHAR(20)' },
                { name: 'receiver_name', def: 'VARCHAR(100)' },
                { name: 'payment_method', def: 'VARCHAR(50)' }
            ];
            
            for (const col of columnsToAdd) {
                try {
                    await connection.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.def}`);
                } catch (e) {
                    // Column might already exist, ignore
                    if (!e.message.includes('Duplicate column name')) {
                        console.log(`Could not add column ${col.name}:`, e.message);
                    }
                }
            }
        }

        const { fname, lname, address, city, state, zip } = shippingDetails || {};
        const receiverName = (fname && lname) ? `${fname} ${lname}`.trim() : 'Unknown Receiver';

        // 1. Create main order record
        const [orderResult] = await connection.query(
            `INSERT INTO orders 
            (user_id, total_price, status, shipping_address, city, state, zip, receiver_name, payment_method) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                totalPrice || 0,
                'pending',
                address || null,
                city || null,
                state || null,
                zip || null,
                receiverName,
                paymentMethod || 'cod' // Default to COD if missing
            ]
        );
        const orderId = orderResult.insertId;

        // 1b. Generate Tracking Code
        const trackingCode = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // Create order_tracking_codes table if it doesn't exist (for order tracking)
        // This is separate from the shipment tracking_codes table
        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS order_tracking_codes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id INT NOT NULL UNIQUE,
                    tracking_code VARCHAR(100) UNIQUE NOT NULL,
                    status VARCHAR(50) DEFAULT 'ordered',
                    current_location VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                    INDEX idx_tracking_code (tracking_code),
                    INDEX idx_order_id (order_id)
                )
            `);
        } catch (tableErr) {
            // Table might already exist, continue
            console.log('order_tracking_codes table check:', tableErr.message);
        }

        // Insert into order_tracking_codes table
        await connection.query(
            'INSERT INTO order_tracking_codes (order_id, tracking_code, status) VALUES (?, ?, ?)',
            [orderId, trackingCode, 'ordered']
        );

        // 2. Group items by vendor to create sub-orders
        const vendorSubtotals = {};
        const vendorIds = [];

        for (const item of items) {
            if (!item.product) continue;

            const product = item.product;
            const vendorId = product.vendor_id || null;
            const lineTotal = (product.price || 0) * (item.quantity || 1);

            if (vendorId) {
                if (!vendorSubtotals[vendorId]) {
                    vendorSubtotals[vendorId] = 0;
                    vendorIds.push(vendorId);
                }
                vendorSubtotals[vendorId] += lineTotal;
            }

            // Create order items
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, product.id, item.quantity, product.price]
            );

            // Update stock
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, product.id]
            );
        }

        // 3. Create sub-orders for each vendor (if table exists and vendors exist)
        if (vendorIds.length > 0) {
            // Ensure sub_orders table exists
            try {
                await connection.query(`
                    CREATE TABLE IF NOT EXISTS sub_orders (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        order_id INT NOT NULL,
                        vendor_id INT NOT NULL,
                        sub_total DECIMAL(10, 2) NOT NULL,
                        commission_amount DECIMAL(10, 2) DEFAULT 0.00,
                        status VARCHAR(50) DEFAULT 'pending',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                        INDEX idx_order_id (order_id),
                        INDEX idx_vendor_id (vendor_id)
                    )
                `);
            } catch (tableErr) {
                console.log('sub_orders table check:', tableErr.message);
            }

            for (const vId of vendorIds) {
                // Get vendor commission rate (default 10%)
                try {
                    const [vendorInfo] = await connection.query('SELECT commission_rate FROM vendors WHERE id = ?', [vId]);
                    const rate = vendorInfo[0]?.commission_rate || 10.00;
                    const subTotal = vendorSubtotals[vId];
                    const commission = (subTotal * rate) / 100;

                    await connection.query(
                        'INSERT INTO sub_orders (order_id, vendor_id, sub_total, commission_amount, status) VALUES (?, ?, ?, ?, ?)',
                        [orderId, vId, subTotal, commission, 'pending']
                    );
                } catch (subOrderErr) {
                    // If vendor table doesn't exist or vendor not found, skip sub-order creation
                    console.log(`Could not create sub-order for vendor ${vId}:`, subOrderErr.message);
                }
            }
        }

        // 4. Clear Cart
        const [cart] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (cart.length > 0) {
            await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
            await connection.query('UPDATE carts SET total_price = 0.00 WHERE id = ?', [cart[0].id]);
        }

        await connection.commit();

        // Real-time Updates
        try {
            const io = req.app.get('io');
            if (io) {
                io.emit('order:new', {
                    id: orderId,
                    totalPrice,
                    customer: receiverName,
                    trackingCode,
                    timestamp: new Date()
                });
                io.emit('vendor:order:new', { orderId });
                io.emit('inventory:update');
            }
        } catch (socketErr) {
            // Socket error shouldn't fail the order creation
            console.log('Socket emit error (non-critical):', socketErr.message);
        }

        res.status(201).json({ message: 'Order created successfully', orderId, trackingCode });
    } catch (err) {
        await connection.rollback();
        console.error('Create order error:', err);
        // Log to file for debugging
        try {
            fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] CreateOrder Error: ${err.message}\n${err.stack}\n`);
        } catch (fsErr) {
            console.error('Failed to write to log file:', fsErr);
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        connection.release();
    }
};

export const getUserOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getVendorOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [vendor] = await db.query('SELECT id FROM vendors WHERE user_id = ?', [userId]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Vendor profile not found' });

        const [orders] = await db.query(`
            SELECT so.*, o.created_at, u.fname, u.lname 
            FROM sub_orders so
            JOIN orders o ON so.order_id = o.id
            JOIN users u ON o.user_id = u.id
            WHERE so.vendor_id = ? 
            ORDER BY so.created_at DESC
        `, [vendor[0].id]);

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (order.length === 0) return res.status(404).json({ message: 'Order not found' });

        const [items] = await db.query(
            'SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
            [id]
        );

        res.json({ ...order[0], items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
