import db from './db.js';

const fixData = async () => {
    try {
        console.log('🔧 Starting Data Conflict Resolution...');

        // 1. Get current conflict user (Tareq) to copy password hash
        const [users] = await db.query('SELECT * FROM users WHERE id = 1');
        if (users.length === 0) {
            console.error('❌ User 1 not found');
            process.exit(1);
        }
        const tareq = users[0];
        console.log('👤 Found User 1:', tareq.email);

        // 2. Create new Vendor Admin User
        const newEmail = 'vendor@test.com';
        // Check if exists first
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [newEmail]);

        let newUserId;

        if (existing.length > 0) {
            console.log('⚠️ Vendor Admin user already exists, using existing ID.');
            newUserId = existing[0].id;
        } else {
            console.log('👤 Creating new Vendor Admin user...');
            const [insertResult] = await db.query(
                'INSERT INTO users (fname, lname, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
                ['Vendor', 'Admin', newEmail, tareq.password_hash, 'vendor']
            );
            newUserId = insertResult.insertId;
            console.log('✅ Created Vendor Admin with ID:', newUserId);
        }

        // 3. Update Vendor 1 to point to New User
        console.log('🏪 Updating Vendor 1 to be owned by New User...');
        await db.query('UPDATE vendors SET user_id = ? WHERE id = 1', [newUserId]);
        console.log('✅ Vendor 1 ownership transferred.');

        // 4. Ensure Tareq is just a Customer
        console.log('👤 Setting Tareq (User 1) role to "customer"...');
        await db.query('UPDATE users SET role = "customer" WHERE id = 1');
        console.log('✅ Tareq is now a strict Customer.');

        console.log('🎉 Data Conflict Resolved!');
        console.log(`\n👉 LOGIN DETAILS for VENDOR:\nEmail: ${newEmail}\nPassword: [Same as Tareq's password]\n`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

fixData();
