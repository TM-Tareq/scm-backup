import db from './db.js';

const fixRole = async () => {
    try {
        console.log('Fixing user role for Tareq Monowar...');
        const [result] = await db.query(
            "UPDATE users SET role = 'customer' WHERE email = 'tmTareq11@gmail.com'"
        );
        console.log('Update result:', result);
        console.log('✅ User role updated to customer');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating role:', err);
        process.exit(1);
    }
};

fixRole();
