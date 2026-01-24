import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        console.log('Running Migration 004...');

        // 1. Add 'role' to users
        try {
            await connection.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer'");
            console.log("Added 'role' to users.");
        } catch (e) {
            console.log("Error adding 'role':", e.message);
        }

        try {
            await connection.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'");
            console.log("Added 'status' to users.");
        } catch (e) {
            console.log("Error adding 'status':", e.message);
        }

        // 2. Create audit_logs
        await connection.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                action VARCHAR(50) NOT NULL,
                resource VARCHAR(50),
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log("Created 'audit_logs' table.");

        // 3. Create system_settings
        await connection.query(`
            CREATE TABLE IF NOT EXISTS system_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(50) UNIQUE NOT NULL,
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("Created 'system_settings' table.");

        // 4. Create announcements if not exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message TEXT NOT NULL,
                type VARCHAR(20) DEFAULT 'info',
                start_date DATETIME,
                end_date DATETIME,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log("Created 'announcements' table.");

        // 5. Create faqs if not exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS faqs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category VARCHAR(50),
                display_order INT DEFAULT 0,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log("Created 'faqs' table.");

        // 6. Ensure 'products' has 'vendor_id'
        try {
            await connection.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS vendor_id INT");
            // Note: FK might fail if key name exists, catch is fine
        } catch (e) { }

        console.log('Migration 004 completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
