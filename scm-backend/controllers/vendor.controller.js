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
            'INSERT INTO vendors (user_id, store_name, store_description, status) VALUES (?, ?, ?, ?)',
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
        const [vendor] = await db.query('SELECT id, status, store_name FROM vendors WHERE user_id = ?', [userId]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Vendor profile not found' });
        if (vendor[0].status !== 'approved') return res.status(403).json({ message: 'Store not approved yet', status: vendor[0].status });

        const vendorId = vendor[0].id;

        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as totalOrders, 
                SUM(sub_total) as totalRevenue,
                SUM(commission_amount) as totalCommission,
                COUNT(CASE WHEN status != 'delivered' AND status != 'cancelled' THEN 1 END) as pendingOrders
            FROM sub_orders 
            WHERE vendor_id = ?
        `, [vendorId]);

        const [products] = await db.query('SELECT COUNT(*) as total, COUNT(CASE WHEN stock <= 10 THEN 1 END) as lowStock FROM products WHERE vendor_id = ?', [vendorId]);

        res.json({
            store_name: vendor[0].store_name,
            stats: {
                totalOrders: stats[0].totalOrders || 0,
                totalRevenue: stats[0].totalRevenue || 0,
                totalCommission: stats[0].totalCommission || 0,
                netEarnings: (stats[0].totalRevenue || 0) - (stats[0].totalCommission || 0),
                totalProducts: products[0].total || 0,
                pendingOrders: stats[0].pendingOrders || 0,
                lowStockCount: products[0].lowStock || 0
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getVendorAnalytics = async (req, res) => {
    const userId = req.user.id;
    try {
        const [vendor] = await db.query('SELECT id FROM vendors WHERE user_id = ?', [userId]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Vendor profile not found' });

        const [salesData] = await db.query(`
            SELECT DATE(created_at) as date, SUM(sub_total) as revenue 
            FROM sub_orders 
            WHERE vendor_id = ? 
            GROUP BY DATE(created_at) 
            ORDER BY date DESC 
            LIMIT 7
        `, [vendor[0].id]);

        res.json(salesData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPayouts = async (req, res) => {
    const userId = req.user.id;
    try {
        const [vendor] = await db.query('SELECT id FROM vendors WHERE user_id = ?', [userId]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Vendor profile not found' });

        const [payouts] = await db.query(`
            SELECT * FROM payouts 
            WHERE vendor_id = ? 
            ORDER BY created_at DESC
        `, [vendor[0].id]);
        res.json(payouts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const requestPayout = async (req, res) => {
    const userId = req.user.id;
    const { amount, notes } = req.body;

    try {
        const [vendor] = await db.query('SELECT id, store_name FROM vendors WHERE user_id = ?', [userId]);
        if (vendor.length === 0) return res.status(403).json({ message: 'Vendor profile not found' });

        const vendorId = vendor[0].id;

        // Simple check: check current net earnings vs already requested/paid amounts
        const [earnings] = await db.query(`
            SELECT SUM(sub_total - commission_amount) as totalNet 
            FROM sub_orders 
            WHERE vendor_id = ? AND status = 'delivered'
        `, [vendorId]);

        const [payouts] = await db.query(`
            SELECT SUM(amount) as totalPaid 
            FROM payouts 
            WHERE vendor_id = ? AND status != 'cancelled'
        `, [vendorId]);

        const available = (earnings[0].totalNet || 0) - (payouts[0].totalPaid || 0);

        if (amount > available) {
            return res.status(400).json({ message: `Insufficient funds. Available: $${available.toFixed(2)}` });
        }

        await db.query(`
            INSERT INTO payouts (vendor_id, amount, status, notes, period_start, period_end) 
            VALUES (?, ?, 'pending', ?, CURDATE(), CURDATE())
        `, [vendorId, amount, notes || `Payout request from ${vendor[0].store_name}`]);

        res.status(201).json({ message: 'Payout request submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

