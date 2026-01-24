import db from '../db.js';
import { sendEmail } from '../config/email.js';
import bcrypt from 'bcrypt';

export const getPendingVendors = async (req, res) => {
    try {
        const [vendors] = await db.query(`
            SELECT v.*, u.fname, u.lname, u.email 
            FROM vendors v 
            JOIN users u ON v.user_id = u.id 
            WHERE v.status = 'pending'
        `);
        res.json(vendors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const approveVendor = async (req, res) => {
    const { vendorId } = req.body;
    try {
        await db.query('UPDATE vendors SET status = ? WHERE id = ?', ['approved', vendorId]);

        // Fetch vendor + user info for role update and email notification
        const [vendorRows] = await db.query(
            `SELECT v.id, v.store_name, u.id as user_id, u.fname, u.lname, u.email 
             FROM vendors v 
             JOIN users u ON v.user_id = u.id 
             WHERE v.id = ?`,
            [vendorId]
        );

        if (vendorRows.length > 0) {
            const vendor = vendorRows[0];

            // Ensure the linked user has vendor role
            await db.query('UPDATE users SET role = ? WHERE id = ?', ['vendor', vendor.user_id]);

            // Send approval email (best-effort)
            await sendEmail({
                to: vendor.email,
                subject: 'Your vendor store has been approved',
                text: `Hi ${vendor.fname},\n\nGood news! Your vendor store "${vendor.store_name}" has been approved by the admin team.\n\nYou can now log in to your vendor portal and start managing your store.\n\nThank you for being part of our marketplace.`,
                html: `<p>Hi <strong>${vendor.fname}</strong>,</p><p>Good news! Your vendor store <strong>${vendor.store_name}</strong> has been <strong>approved</strong> by the admin team.</p><p>You can now log in to your vendor portal and start managing your store.</p><p>Thank you for being part of our marketplace.</p>`
            });
        }

        res.json({ message: 'Vendor approved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const rejectVendor = async (req, res) => {
    const { vendorId } = req.body;
    try {
        await db.query('UPDATE vendors SET status = ? WHERE id = ?', ['rejected', vendorId]);

        // Fetch vendor + user info for notification
        const [vendorRows] = await db.query(
            `SELECT v.id, v.store_name, u.fname, u.lname, u.email 
             FROM vendors v 
             JOIN users u ON v.user_id = u.id 
             WHERE v.id = ?`,
            [vendorId]
        );

        if (vendorRows.length > 0) {
            const vendor = vendorRows[0];

            await sendEmail({
                to: vendor.email,
                subject: 'Your vendor verification request was not approved',
                text: `Hi ${vendor.fname},\n\nYour vendor store "${vendor.store_name}" was not approved at this time.\n\nYou can update your store details and request verification again from your vendor portal.\n\nIf you believe this is a mistake, please contact support.`,
                html: `<p>Hi <strong>${vendor.fname}</strong>,</p><p>Your vendor store <strong>${vendor.store_name}</strong> was <strong>not approved</strong> at this time.</p><p>You can update your store details and request verification again from your vendor portal.</p><p>If you believe this is a mistake, please contact support.</p>`
            });
        }

        res.json({ message: 'Vendor rejected' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        const [vendors] = await db.query(`
            SELECT v.*, u.fname, u.lname, u.email, v.created_at
            FROM vendors v 
            JOIN users u ON v.user_id = u.id 
            ORDER BY v.created_at DESC
        `);
        console.log(`Found ${vendors.length} vendors`);
        res.json(vendors);
    } catch (err) {
        console.error('Get All Vendors Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// --- COMMISSIONS ---
export const getCommissions = async (req, res) => {
    try {
        const [commissions] = await db.query('SELECT c.*, u.fname, u.lname FROM commissions c JOIN users u ON c.created_by = u.id ORDER BY c.effective_date DESC');
        res.json(commissions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const setCommissionRate = async (req, res) => {
    const { rate_percentage, effective_date, notes } = req.body;
    const userId = req.user.id;
    try {
        await db.query(
            'INSERT INTO commissions (rate_percentage, effective_date, created_by, notes) VALUES (?, ?, ?, ?)',
            [rate_percentage, effective_date, userId, notes]
        );
        res.json({ message: 'Commission rate updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- PAYOUTS ---
export const getPayouts = async (req, res) => {
    try {
        const [payouts] = await db.query(`
            SELECT p.*, v.store_name 
            FROM payouts p 
            JOIN vendors v ON p.vendor_id = v.id 
            ORDER BY p.created_at DESC
        `);
        res.json(payouts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePayoutStatus = async (req, res) => {
    const { payoutId, status, notes } = req.body;
    const adminId = req.user.id;
    try {
        await db.query(
            'UPDATE payouts SET status = ?, notes = ?, paid_at = IF(? = "paid", CURRENT_TIMESTAMP, paid_at), paid_by = ? WHERE id = ?',
            [status, notes, status, adminId, payoutId]
        );
        res.json({ message: 'Payout status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- CARRIERS ---
export const getCarriers = async (req, res) => {
    try {
        const [carriers] = await db.query('SELECT * FROM carriers ORDER BY name ASC');
        res.json(carriers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addCarrier = async (req, res) => {
    const { name, logo_url, tracking_url_template } = req.body;
    try {
        await db.query(
            'INSERT INTO carriers (name, logo_url, tracking_url_template) VALUES (?, ?, ?)',
            [name, logo_url, tracking_url_template]
        );
        res.json({ message: 'Carrier added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCarrier = async (req, res) => {
    const { id } = req.params;
    const { name, logo_url, tracking_url_template, status } = req.body;
    try {
        await db.query(
            'UPDATE carriers SET name = ?, logo_url = ?, tracking_url_template = ?, status = ? WHERE id = ?',
            [name, logo_url, tracking_url_template, status || 'active', id]
        );
        res.json({ message: 'Carrier updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCarrier = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM carriers WHERE id = ?', [id]);
        res.json({ message: 'Carrier deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- CONTENT MANAGEMENT (FAQs & Announcements) ---
export const getFAQs = async (req, res) => {
    try {
        const [faqs] = await db.query('SELECT * FROM faqs ORDER BY display_order ASC');
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addFAQ = async (req, res) => {
    const { question, answer, category, display_order } = req.body;
    const userId = req.user.id;
    try {
        await db.query(
            'INSERT INTO faqs (question, answer, category, display_order, created_by) VALUES (?, ?, ?, ?, ?)',
            [question, answer, category, display_order || 0, userId]
        );
        res.json({ message: 'FAQ added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAnnouncements = async (req, res) => {
    try {
        const [announcements] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addAnnouncement = async (req, res) => {
    const { title, message, type, audience, start_date, end_date } = req.body;
    const userId = req.user.id;
    try {
        await db.query(
            'INSERT INTO announcements (title, message, audience, type, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title || 'Announcement', message, audience || 'All Users', type || 'info', start_date, end_date, userId]
        );
        res.json({ message: 'Announcement created' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- AUDIT LOGS ---
export const getAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT a.*, u.fname, u.lname 
            FROM audit_logs a 
            LEFT JOIN users u ON a.user_id = u.id 
            ORDER BY a.created_at DESC 
            LIMIT 100
        `);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- ANALYTICS ---
export const getPlatformAnalytics = async (req, res) => {
    try {
        // Simple aggregate analytics
        const [users] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
        const [vendorCount] = await db.query('SELECT COUNT(*) as count FROM vendors WHERE status = "approved"');
        const [orderStats] = await db.query('SELECT COUNT(*) as count, SUM(total_price) as revenue FROM orders');
        const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE status = "approved"');

        res.json({
            users: users[0].count,
            vendors: vendorCount[0].count,
            orders: orderStats[0].count,
            revenue: orderStats[0].revenue || 0,
            products: products[0].count
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- EDITOR MANAGEMENT ---
export const addEditor = async (req, res) => {
    const { fname, lname, email, password } = req.body;
    try {
        // Check if user exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (fname, lname, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [fname, lname, email, hashedPassword, 'editor', 'active']
        );

        res.status(201).json({ message: 'Editor created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getEditors = async (req, res) => {
    try {
        const [editors] = await db.query("SELECT id, fname, lname, email, status, created_at FROM users WHERE role = 'editor'");
        res.json(editors);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateEditorStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
        await db.query('UPDATE users SET status = ? WHERE id = ? AND role = "editor"', [status, id]);
        res.json({ message: 'Editor status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteEditor = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE users SET role = "customer" WHERE id = ? AND role = "editor"', [id]);
        res.json({ message: 'Editor demoted to customer' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- SYSTEM SETTINGS ---
export const getSystemSettings = async (req, res) => {
    try {
        const [settings] = await db.query('SELECT * FROM system_settings');
        // Convert to object
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.setting_key] = s.setting_value;
        });
        res.json(settingsObj);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateSystemSettings = async (req, res) => {
    const settings = req.body; // { key: value, key2: value2 }
    try {
        const keys = Object.keys(settings);
        for (const key of keys) {
            const value = settings[key];
            await db.query(
                'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, value, value]
            );
        }
        res.json({ message: 'Settings updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUsersWithAnalytics = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT 
                u.id, u.fname, u.lname, u.email, u.role, u.status, u.created_at,
                COUNT(o.id) as total_orders,
                IFNULL(SUM(o.total_price), 0) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            GROUP BY u.id, u.fname, u.lname, u.email, u.role, u.status, u.created_at
            ORDER BY total_spent DESC
        `);
        console.log(`Found ${users.length} users`);
        res.json(users);
    } catch (err) {
        console.error('Get Users With Analytics Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getUserOrderHistory = async (req, res) => {
    const { userId } = req.params;
    try {
        const [orders] = await db.query(`
            SELECT o.*, 
                (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
            FROM orders o
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `, [userId]);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
