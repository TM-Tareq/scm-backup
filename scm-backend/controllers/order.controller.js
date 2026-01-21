import db from '../db.js';

export const createOrder = async (req, res) => {
    const { items, totalPrice, shippingDetails, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create order record
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
            [userId, totalPrice, 'pending']
        );
        const orderId = orderResult.insertId;

        // 2. Create order items and update stock
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product.id, item.quantity, item.product.price]
            );

            // Update stock
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product.id]
            );
        }

        // 3. Clear Cart
        const [cart] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (cart.length > 0) {
            await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
            await connection.query('UPDATE carts SET total_price = 0.00 WHERE id = ?', [cart[0].id]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (err) {
        await connection.rollback();
        console.error('Create order error:', err);
        res.status(500).json({ message: 'Server error' });
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
