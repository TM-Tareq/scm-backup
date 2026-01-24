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
        console.log('Running Migration 006...');

        try {
            await connection.query("ALTER TABLE announcements ADD COLUMN title VARCHAR(255) DEFAULT 'Announcement'");
            console.log("Added 'title' to announcements.");
        } catch (e) {
            console.log("Error adding 'title':", e.message);
        }

        try {
            await connection.query("ALTER TABLE announcements ADD COLUMN audience VARCHAR(50) DEFAULT 'All Users'");
            console.log("Added 'audience' to announcements.");
        } catch (e) {
            console.log("Error adding 'audience':", e.message);
        }

        console.log('Migration 006 completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
