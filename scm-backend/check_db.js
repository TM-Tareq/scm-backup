import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function check() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [columns] = await connection.query('SHOW COLUMNS FROM blogs');
        const fs = await import('fs');
        fs.writeFileSync('full_columns.json', JSON.stringify(columns, null, 2));
        console.log('Saved to full_columns.json');
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) await connection.end();
    }
}
check();
