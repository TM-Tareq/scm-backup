import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function fix() {
    console.log('🔌 Connecting to database...');
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log('🛠️ Fixing `orders` table schema...');

        await connection.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address VARCHAR(255)");
        console.log('✅ Added shipping_address');

        await connection.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS city VARCHAR(100)");
        console.log('✅ Added city');

        await connection.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS state VARCHAR(100)");
        console.log('✅ Added state');

        await connection.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS zip VARCHAR(20)");
        console.log('✅ Added zip');

        await connection.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(100)");
        console.log('✅ Added receiver_name');

        await connection.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)");
        console.log('✅ Added payment_method');

        console.log('✨ Database fix completed successfully!');
    } catch (err) {
        console.error('❌ Error applying fix:', err);
    } finally {
        await connection.end();
        process.exit();
    }
}

fix();
