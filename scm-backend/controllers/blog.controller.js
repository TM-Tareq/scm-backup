import db from '../db.js';

export const createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const userId = req.user?.id;

        console.log('Blog submission request:', {
            hasUser: !!req.user,
            userId,
            title: title?.substring(0, 50),
            category,
            hasFiles: !!req.files,
            filesCount: req.files?.length || 0
        });

        if (!userId) {
            console.error('No user ID found in request');
            return res.status(401).json({ message: 'User authentication required' });
        }

        if (!title || !content || !category) {
            console.error('Missing required fields:', { title: !!title, content: !!content, category: !!category });
            return res.status(400).json({ message: 'Title, content, and category are required' });
        }

        // Handle file uploads - images is optional
        let images = null;
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => {
                // Normalize path for cross-platform compatibility
                const normalizedPath = file.path.replace(/\\/g, '/');
                console.log('File uploaded:', normalizedPath);
                return normalizedPath;
            }).join(',');
        }

        console.log('Inserting blog into database...');

        // Insert blog with user_id (based on actual database schema)
        // mysql2/promise returns [rows, fields] for all queries
        const [result] = await db.query(
            'INSERT INTO blogs (title, content, category, image_url, user_id, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title.trim(), content.trim(), category.trim(), images, userId, 'pending']
        );

        const blogId = result.insertId;
        console.log('✅ Blog created successfully with ID:', blogId);

        res.status(201).json({ 
            message: 'Blog submitted for review', 
            blogId: blogId,
            image_url: images 
        });
    } catch (err) {
        console.error('❌ Create Blog Error:', err);
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
            errno: err.errno
        });

        // Clean up uploaded files if database insert failed
        if (req.files && req.files.length > 0) {
            const fs = require('fs');
            req.files.forEach(file => {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                        console.log('Cleaned up file:', file.path);
                    }
                } catch (cleanupErr) {
                    console.error('Error cleaning up file:', cleanupErr);
                }
            });
        }

        res.status(500).json({ 
            message: 'Failed to create blog', 
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? {
                code: err.code,
                sqlState: err.sqlState,
                sqlMessage: err.sqlMessage
            } : undefined
        });
    }
};

export const getPendingBlogs = async (req, res) => {
    try {
        console.log('Fetching pending blogs for admin...');
        console.log('Admin user:', req.user);
        
        // Use user_id (based on actual database schema)
        const [blogs] = await db.query(`
            SELECT b.*, u.fname, u.lname 
            FROM blogs b 
            JOIN users u ON b.user_id = u.id
            WHERE b.status = 'pending' 
            ORDER BY b.created_at ASC
        `);
        
        console.log(`Found ${blogs.length} pending blogs:`, blogs.map(b => ({ id: b.id, title: b.title })));
        res.json(blogs);
    } catch (err) {
        console.error('Get Pending Blogs Error:', err);
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            sqlState: err.sqlState
        });
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateBlogStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
        await db.query('UPDATE blogs SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Blog ${status}` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const [blogs] = await db.query(`
            SELECT b.*, u.fname, u.lname,
            (SELECT COUNT(*) FROM blog_reactions WHERE blog_id = b.id) as like_count,
            (SELECT COUNT(*) FROM blog_comments WHERE blog_id = b.id) as comment_count
            FROM blogs b 
            JOIN users u ON b.user_id = u.id
            WHERE b.status = 'accepted' 
            ORDER BY b.created_at DESC
        `);
        res.json(blogs);
    } catch (err) {
        console.error('Get All Blogs Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const [blog] = await db.query(`
            SELECT b.*, u.fname, u.lname,
            (SELECT COUNT(*) FROM blog_reactions WHERE blog_id = b.id) as like_count,
            (SELECT COUNT(*) FROM blog_comments WHERE blog_id = b.id) as comment_count
            FROM blogs b 
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ?
        `, [id]);

        if (blog.length === 0) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog[0]);
    } catch (err) {
        console.error('Get Blog By ID Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const reactToBlog = async (req, res) => {
    const { blogId, type } = req.body;
    const userId = req.user.id;

    try {
        // Toggle reaction
        const [existing] = await db.query('SELECT id FROM blog_reactions WHERE blog_id = ? AND user_id = ?', [blogId, userId]);

        if (existing.length > 0) {
            await db.query('DELETE FROM blog_reactions WHERE blog_id = ? AND user_id = ?', [blogId, userId]);
            return res.json({ message: 'Reaction removed' });
        }

        await db.query('INSERT INTO blog_reactions (blog_id, user_id, type) VALUES (?, ?, ?)', [blogId, userId, type || 'like']);
        res.json({ message: 'Reaction added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addComment = async (req, res) => {
    const { blogId, content } = req.body;
    const userId = req.user.id;

    try {
        await db.query('INSERT INTO blog_comments (blog_id, user_id, content) VALUES (?, ?, ?)', [blogId, userId, content]);
        res.status(201).json({ message: 'Comment added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getComments = async (req, res) => {
    const { blogId } = req.params;
    try {
        const [comments] = await db.query(`
            SELECT c.*, u.fname, u.lname 
            FROM blog_comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.blog_id = ? 
            ORDER BY c.created_at DESC
        `, [blogId]);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
