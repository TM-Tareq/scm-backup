import db from './db.js';

const debugData = async () => {
    try {
        console.log('🔍 Checking data for Product ID 1...');

        // Check Product
        const [products] = await db.query('SELECT * FROM products WHERE id = 1');
        if (products.length === 0) {
            console.log('❌ Product 1 not found');
            process.exit(0);
        }
        const product = products[0];
        console.log('📦 Product:', { id: product.id, name: product.name, vendor_id: product.vendor_id });

        if (!product.vendor_id) {
            console.log('❌ Product has no vendor_id');
            process.exit(0);
        }

        // Check Vendor
        const [vendors] = await db.query('SELECT * FROM vendors WHERE id = ?', [product.vendor_id]);
        if (vendors.length === 0) {
            console.log(`❌ Vendor ${product.vendor_id} not found`);
            process.exit(0);
        }
        const vendor = vendors[0];
        console.log('👤 Vendor:', { id: vendor.id, store_name: vendor.store_name, user_id: vendor.user_id });

        if (!vendor.user_id) {
            console.log('❌ Vendor has no user_id (NULL or undefined). This is the root cause.');
        } else {
            // Check User
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [vendor.user_id]);
            if (users.length === 0) {
                console.log(`❌ User ${vendor.user_id} (linked to vendor) not found in users table.`);
            } else {
                console.log('✅ Vendor User found:', { id: users[0].id, email: users[0].email, role: users[0].role });
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

debugData();
