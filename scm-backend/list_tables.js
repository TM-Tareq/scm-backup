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
        const [tables] = await connection.query('SHOW TABLES');
        console.log(JSON.stringify(tables, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) await connection.end();
    }
}
check();
