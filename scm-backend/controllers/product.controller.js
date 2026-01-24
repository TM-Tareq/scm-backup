import db from '../db.js';

export const getAllProducts = async (req, res) => {
    try {
        const query = `
            SELECT p.*, v.store_name 
            FROM products p 
            LEFT JOIN vendors v ON p.vendor_id = v.id
        `;
        const [products] = await db.query(query);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [product] = await db.query(`
            SELECT p.*, v.store_name, v.user_id AS vendor_user_id 
            FROM products p 
            LEFT JOIN vendors v ON p.vendor_id = v.id
            WHERE p.id = ?
        `, [id]);

        if (product.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(product[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.user.id; // Corrected: user.id might be user_id, need to find vendor_id from user_id or if role is vendor, maybe stored in token? 
        // Wait, the token typically has user_id. We need to find the vendor_id associated with this user.
        // OR we can join tables. 
        // Let's assume req.user has { id, role }. We need to find the vendor record.

        // Better: Fetch vendor_id first.
        const [vendor] = await db.query('SELECT id FROM vendors WHERE user_id = ?', [req.user.id]);
        if (vendor.length === 0) return res.status(404).json({ message: 'Vendor profile not found' });

        const [products] = await db.query('SELECT * FROM products WHERE vendor_id = ?', [vendor[0].id]);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const images = req.files ? req.files.map(file => file.path).join(',') : ''; // Store paths comma separated or separate table

        // Get Vendor ID
        const [vendor] = await db.query('SELECT id, status FROM vendors WHERE user_id = ?', [req.user.id]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Vendor profile not found' });
        if (vendor[0].status !== 'approved') return res.status(403).json({ message: 'Store not verified. Please wait for admin approval.' });

        const query = `INSERT INTO products (name, description, price, stock, category, image, vendor_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await db.query(query, [name, description, price, stock, category, images, vendor[0].id]);

        res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Get vendor for current user
        const [vendor] = await db.query('SELECT id, status FROM vendors WHERE user_id = ?', [req.user.id]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Vendor profile not found' });
        if (vendor[0].status !== 'approved') return res.status(403).json({ message: 'Store not verified' });

        // Ensure product belongs to this vendor
        const [existing] = await db.query('SELECT * FROM products WHERE id = ? AND vendor_id = ?', [id, vendor[0].id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        // Handle images
        if (req.files && req.files.length > 0) {
            updates.image = req.files.map(file => file.path).join(',');
        }

        // Build dynamic query
        const fields = [];
        const values = [];
        const allowedFields = ['name', 'description', 'price', 'stock', 'category', 'image'];

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updates[key]);
            }
        }

        if (fields.length === 0) {
            return res.json({ message: 'No changes provided' });
        }

        values.push(id);

        await db.query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Verify ownership
        const [vendor] = await db.query('SELECT id, status FROM vendors WHERE user_id = ?', [req.user.id]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Unauthorized' });
        if (vendor[0].status !== 'approved') return res.status(403).json({ message: 'Store not verified' });

        const [product] = await db.query('SELECT * FROM products WHERE id = ? AND vendor_id = ?', [id, vendor[0].id]);
        if (product.length === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });

        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
