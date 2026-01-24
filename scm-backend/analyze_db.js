import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function analyzeDatabase() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Get all tables
        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);

        console.log(`\n📊 Total Tables: ${tableNames.length}\n`);
        console.log('Tables List:');
        console.log('='.repeat(50));

        for (const tableName of tableNames) {
            // Get row count
            const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
            const rowCount = countResult[0].count;

            // Get column info
            const [columns] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
            const columnCount = columns.length;

            console.log(`${tableName.padEnd(30)} | Rows: ${String(rowCount).padStart(6)} | Columns: ${columnCount}`);
        }

        console.log('='.repeat(50));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}

analyzeDatabase();
