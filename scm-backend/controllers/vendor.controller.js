import db from '../db.js';

export const createProfile = async (req, res) => {
    const { store_name, store_description } = req.body;
    const userId = req.user.id;

    if (!store_name) {
        return res.status(400).json({ message: 'Store name is required' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM vendors WHERE user_id = ?', [userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Vendor profile already exists' });
        }

        await db.query(
            'INSERT INTO vendors (user_id, store_name, description, status) VALUES (?, ?, ?, ?)',
            [userId, store_name, store_description || null, 'pending']
        );

        res.status(201).json({ message: 'Vendor profile created successfully. Waiting for admin approval.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getVendorStatus = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            `SELECT id, store_name, status, created_at 
             FROM vendors 
             WHERE user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.json({
                hasProfile: false,
                status: 'none'
            });
        }

        const vendor = rows[0];

        return res.json({
            hasProfile: true,
            vendorId: vendor.id,
            store_name: vendor.store_name,
            status: vendor.status,
            created_at: vendor.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const requestVendorApproval = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            'SELECT id, status FROM vendors WHERE user_id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Vendor profile not found. Please create your store first.' });
        }

        const vendor = rows[0];

        if (vendor.status === 'approved') {
            return res.status(400).json({ message: 'Your store is already approved.' });
        }

        await db.query(
            'UPDATE vendors SET status = ? WHERE id = ?',
            ['pending', vendor.id]
        );

        res.json({ message: 'Verification request sent to admin. Your store is now pending review.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getDashboardStats = async (req, res) => {
    const userId = req.user.id;

    try {
        // Get vendor ID and ensure vendor is approved
        const [vendor] = await db.query(
            'SELECT id, status FROM vendors WHERE user_id = ?',
            [userId]
        );

        if (vendor.length === 0) {
            return res.status(403).json({ message: 'Vendor profile not found' });
        }

        if (vendor[0].status !== 'approved') {
            return res.status(403).json({ message: 'Store not approved yet', status: vendor[0].status });
        }

        const vendorId = vendor[0].id;

        // Get total sales and order count
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as totalOrders, 
                SUM(sub_total) as totalRevenue,
                SUM(commission_amount) as totalCommission
            FROM sub_orders 
            WHERE vendor_id = ?
        `, [vendorId]);

        // Get product count
        const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE vendor_id = ?', [vendorId]);

        res.json({
            stats: {
                totalOrders: stats[0].totalOrders || 0,
                totalRevenue: stats[0].totalRevenue || 0,
                totalCommission: stats[0].totalCommission || 0,
                netEarnings: (stats[0].totalRevenue || 0) - (stats[0].totalCommission || 0),
                totalProducts: products[0].count || 0
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
