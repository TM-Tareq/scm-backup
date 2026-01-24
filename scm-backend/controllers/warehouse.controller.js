import db from '../db.js';

// Get all warehouses
export const getAllWarehouses = async (req, res) => {
    try {
        const [warehouses] = await db.query('SELECT * FROM warehouses ORDER BY created_at DESC');
        res.json(warehouses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single warehouse by ID
export const getWarehouseById = async (req, res) => {
    try {
        const [warehouse] = await db.query('SELECT * FROM warehouses WHERE id = ?', [req.params.id]);
        if (warehouse.length === 0) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.json(warehouse[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new warehouse
export const createWarehouse = async (req, res) => {
    const { name, location, capacity, contact_info } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO warehouses (name, location, capacity, contact_info) VALUES (?, ?, ?, ?)',
            [name, location, capacity, contact_info]
        );
        res.status(201).json({ id: result.insertId, name, location, capacity, contact_info });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update warehouse
export const updateWarehouse = async (req, res) => {
    const { name, location, capacity, contact_info } = req.body;
    try {
        await db.query(
            'UPDATE warehouses SET name = ?, location = ?, capacity = ?, contact_info = ? WHERE id = ?',
            [name, location, capacity, contact_info, req.params.id]
        );
        res.json({ message: 'Warehouse updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete warehouse
export const deleteWarehouse = async (req, res) => {
    try {
        await db.query('DELETE FROM warehouses WHERE id = ?', [req.params.id]);
        res.json({ message: 'Warehouse deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get inventory for a specific warehouse
export const getWarehouseInventory = async (req, res) => {
    try {
        const query = `
            SELECT wi.*, p.name as product_name, p.sku, p.price, p.image 
            FROM warehouse_inventory wi
            JOIN products p ON wi.product_id = p.id
            WHERE wi.warehouse_id = ?
        `;
        const [inventory] = await db.query(query, [req.params.id]);
        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add/Update stock in a warehouse
export const updateStock = async (req, res) => {
    const { warehouse_id, product_id, quantity } = req.body;
    try {
        const [existing] = await db.query(
            'SELECT * FROM warehouse_inventory WHERE warehouse_id = ? AND product_id = ?',
            [warehouse_id, product_id]
        );

        if (existing.length > 0) {
            await db.query(
                'UPDATE warehouse_inventory SET quantity = ? WHERE id = ?',
                [quantity, existing[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO warehouse_inventory (warehouse_id, product_id, quantity) VALUES (?, ?, ?)',
                [warehouse_id, product_id, quantity]
            );
        }
        res.json({ message: 'Stock updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
