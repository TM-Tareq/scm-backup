import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function createRBACTables() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        // 1. Create roles table
        console.log('Creating roles table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                permissions JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Create user_roles linking table
        console.log('Creating user_roles table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                role_id INT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                assigned_by INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
                UNIQUE KEY unique_user_role (user_id, role_id)
            )
        `);

        // 3. Create audit_logs table
        console.log('Creating audit_logs table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                action VARCHAR(50) NOT NULL,
                target_table VARCHAR(100),
                target_id INT,
                changes JSON,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user (user_id),
                INDEX idx_created_at (created_at),
                INDEX idx_target (target_table, target_id)
            )
        `);

        // 4. Create commissions table
        console.log('Creating commissions table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS commissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                rate_percentage DECIMAL(5, 2) NOT NULL,
                effective_date DATE NOT NULL,
                created_by INT NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_effective_date (effective_date DESC)
            )
        `);

        // 5. Create payouts table
        console.log('Creating payouts table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS payouts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                vendor_id INT NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                commission_amount DECIMAL(10, 2) NOT NULL,
                commission_rate DECIMAL(5, 2) NOT NULL,
                status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
                period_start DATE NOT NULL,
                period_end DATE NOT NULL,
                paid_at TIMESTAMP NULL,
                paid_by INT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
                FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_vendor (vendor_id),
                INDEX idx_status (status),
                INDEX idx_period (period_start, period_end)
            )
        `);

        // 6. Create carriers table
        console.log('Creating carriers table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS carriers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                logo_url VARCHAR(255),
                tracking_url_template VARCHAR(500),
                is_enabled BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // 7. Create faqs table
        console.log('Creating faqs table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS faqs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category VARCHAR(100),
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_by INT,
                updated_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_category (category),
                INDEX idx_order (display_order)
            )
        `);

        // 8. Create announcements table
        console.log('Creating announcements table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message TEXT NOT NULL,
                type ENUM('info', 'warning', 'success', 'danger') DEFAULT 'info',
                is_active BOOLEAN DEFAULT TRUE,
                created_by INT NOT NULL,
                start_date TIMESTAMP NULL,
                end_date TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_active (is_active, start_date, end_date)
            )
        `);

        // 9. Seed default roles
        console.log('Seeding default roles...');
        const adminPermissions = JSON.stringify({
            all: true,
            dashboard: ['view', 'analytics'],
            vendors: ['view', 'edit', 'approve', 'suspend'],
            users: ['view', 'edit', 'delete', 'suspend'],
            products: ['view', 'edit', 'delete'],
            orders: ['view', 'edit', 'cancel'],
            commissions: ['view', 'set'],
            payouts: ['view', 'mark_paid'],
            editors: ['create', 'view', 'delete'],
            faqs: ['create', 'edit', 'delete'],
            announcements: ['create', 'edit', 'delete'],
            audit_logs: ['view'],
            carriers: ['manage'],
            analytics: ['view']
        });

        const editorPermissions = JSON.stringify({
            dashboard: ['view'],
            vendors: ['view', 'edit'],
            users: ['view', 'edit', 'suspend'],
            products: ['view'],
            faqs: ['create', 'edit', 'delete'],
            audit_logs: ['view_own'],
        });

        await connection.query(`
            INSERT IGNORE INTO roles (name, description, permissions) VALUES
            ('admin', 'Platform Administrator - Full System Access', ?),
            ('editor', 'Content Editor - Limited Management Access', ?),
            ('vendor', 'Vendor Account - Store Management Only', '{}')
        `, [adminPermissions, editorPermissions]);

        console.log('RBAC tables created and seeded successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

createRBACTables();
