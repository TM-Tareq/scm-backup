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
        const [users] = await connection.query('SELECT id, email, role FROM users LIMIT 10');
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) await connection.end();
    }
}
check();
