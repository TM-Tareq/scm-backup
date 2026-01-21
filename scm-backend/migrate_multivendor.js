import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function migrateDatabase() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        // 1. Add role to users
        console.log('Adding role to users table...');
        try {
            await connection.query("ALTER TABLE users ADD COLUMN role ENUM('customer', 'vendor', 'admin') DEFAULT 'customer'");
            console.log("Verified: 'role' column added/exists in users.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("Skipping: 'role' column already exists.");
            } else {
                throw err;
            }
        }

        // 2. Create vendors table
        console.log('Creating vendors table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS vendors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                store_name VARCHAR(100) NOT NULL,
                store_description TEXT,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                commission_rate DECIMAL(5, 2) DEFAULT 10.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 3. Add vendor_id to products
        console.log('Adding vendor_id to products table...');
        try {
            await connection.query("ALTER TABLE products ADD COLUMN vendor_id INT");
            await connection.query("ALTER TABLE products ADD CONSTRAINT fk_product_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL");
            console.log("Verified: 'vendor_id' added to products.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("Skipping: 'vendor_id' column already exists.");
            } else if (err.code === 'ER_DUP_KEYNAME') {
                console.log("Skipping: FK constraint already exists.");
            } else {
                throw err;
            }
        }

        // 4. Create sub_orders (Vendor Orders)
        console.log('Creating sub_orders table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS sub_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                vendor_id INT NOT NULL,
                sub_total DECIMAL(10, 2) NOT NULL,
                commission_amount DECIMAL(10, 2) DEFAULT 0.00,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
            )
        `);

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrateDatabase();
