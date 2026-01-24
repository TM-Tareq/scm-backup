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
        console.log('Running Migration 007 (Fixing Blogs & Interactions)...');

        // 1. Fix blogs table: Add image_url if missing, ensure user_id/created_by consistency
        // Let's use 'user_id' as the standard column name but allow 'created_by' as an alias or just rename.
        // Artifacts use 'user_id', my controller used 'created_by'. I'll standardize on 'user_id'.

        const [columns] = await connection.query('SHOW COLUMNS FROM blogs');
        const fields = columns.map(c => c.Field);

        if (!fields.includes('image_url')) {
            await connection.query('ALTER TABLE blogs ADD COLUMN image_url TEXT');
            console.log("Added 'image_url' to blogs.");
        }

        if (fields.includes('created_by') && !fields.includes('user_id')) {
            await connection.query('ALTER TABLE blogs CHANGE COLUMN created_by user_id INT');
            console.log("Renamed 'created_by' to 'user_id' in blogs.");
        } else if (!fields.includes('user_id') && !fields.includes('created_by')) {
            await connection.query('ALTER TABLE blogs ADD COLUMN user_id INT');
            console.log("Added 'user_id' to blogs.");
        }

        // 2. Ensure blog_comments table
        const [commentCols] = await connection.query('SHOW COLUMNS FROM blog_comments');
        const commentFields = commentCols.map(c => c.Field);
        if (commentFields.includes('comment') && !commentFields.includes('content')) {
            await connection.query('ALTER TABLE blog_comments CHANGE COLUMN comment content TEXT NOT NULL');
            console.log("Renamed 'comment' to 'content' in blog_comments.");
        }

        await connection.query(`
            CREATE TABLE IF NOT EXISTS blog_comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                blog_id INT NOT NULL,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("Verified 'blog_comments' table.");

        // 3. Ensure blog_reactions table
        const [reactCols] = await connection.query('SHOW COLUMNS FROM blog_reactions');
        const reactFields = reactCols.map(c => c.Field);
        if (reactFields.includes('reaction_type') && !reactFields.includes('type')) {
            await connection.query('ALTER TABLE blog_reactions CHANGE COLUMN reaction_type type VARCHAR(20) NOT NULL');
            console.log("Renamed 'reaction_type' to 'type' in blog_reactions.");
        }

        await connection.query(`
            CREATE TABLE IF NOT EXISTS blog_reactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                blog_id INT NOT NULL,
                user_id INT NOT NULL,
                type VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_blog_reaction (user_id, blog_id)
            )
        `);
        console.log("Verified 'blog_reactions' table.");

        console.log('Migration 007 completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
