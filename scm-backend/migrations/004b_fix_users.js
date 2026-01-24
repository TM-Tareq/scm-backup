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
        connection = await mysql.createConnection(dbConfig);
        console.log('Patching users table...');

        try {
            await connection.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer'");
            console.log("Added 'role'");
        } catch (e) {
            console.log("'role' probably exists:", e.message);
        }

        try {
            await connection.query("ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active'");
            console.log("Added 'status'");
        } catch (e) {
            console.log("'status' probably exists:", e.message);
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
