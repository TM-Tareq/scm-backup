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

        console.log('Adding shipping columns to orders table...');

        const alterQueries = [
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address VARCHAR(255)",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS city VARCHAR(100)",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS state VARCHAR(100)",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS zip VARCHAR(20)",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(100)",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)"
        ];

        for (const query of alterQueries) {
            await connection.query(query);
        }

        console.log('Migration 003 completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
