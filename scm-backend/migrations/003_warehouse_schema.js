import db from '../config/db.js';

const createWarehouseTables = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS warehouses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                capacity INT DEFAULT 0,
                contact_info VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Warehouses table created');

        await db.query(`
            CREATE TABLE IF NOT EXISTS warehouse_inventory (
                id INT AUTO_INCREMENT PRIMARY KEY,
                warehouse_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE KEY unique_warehouse_product (warehouse_id, product_id)
            )
        `);
        console.log('✅ Warehouse Inventory table created');

        await db.query(`
            CREATE TABLE IF NOT EXISTS stock_transfers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                source_warehouse_id INT,
                target_warehouse_id INT,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (source_warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
                FOREIGN KEY (target_warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Stock Transfers table created');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating warehouse tables:', err);
        process.exit(1);
    }
};

createWarehouseTables();
