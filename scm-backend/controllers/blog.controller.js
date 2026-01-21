import db from '../db.js';

export const createBlog = async (req, res) => {
    const { title, content, category, productId } = req.body;
    const userId = req.user.id;

    try {
        await db.query(
            'INSERT INTO blogs (user_id, title, content, category, product_id, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, title, content, category, productId || null, 'pending']
        );
        res.status(201).json({ message: 'Blog post submitted and pending approval' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAcceptedBlogs = async (req, res) => {
    try {
        const [blogs] = await db.query(
            'SELECT b.*, u.fname, u.lname FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.status = ? ORDER BY b.created_at DESC',
            ['accepted']
        );
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getBlogDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [blog] = await db.query(
            'SELECT b.*, u.fname, u.lname FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.id = ?',
            [id]
        );
        if (blog.length === 0) return res.status(404).json({ message: 'Blog not found' });

        // Get comments
        const [comments] = await db.query(
            'SELECT c.*, u.fname, u.lname FROM blog_comments c JOIN users u ON c.user_id = u.id WHERE c.blog_id = ? ORDER BY c.created_at DESC',
            [id]
        );

        // Get reactions count
        const [reactions] = await db.query(
            'SELECT type, COUNT(*) as count FROM blog_reactions WHERE blog_id = ? GROUP BY type',
            [id]
        );

        res.json({ ...blog[0], comments, reactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addComment = async (req, res) => {
    const { blogId, content } = req.body;
    const userId = req.user.id;

    try {
        await db.query(
            'INSERT INTO blog_comments (blog_id, user_id, content) VALUES (?, ?, ?)',
            [blogId, userId, content]
        );
        res.status(201).json({ message: 'Comment added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const toggleReaction = async (req, res) => {
    const { blogId, type } = req.body;
    const userId = req.user.id;

    try {
        const [existing] = await db.query(
            'SELECT id FROM blog_reactions WHERE blog_id = ? AND user_id = ? AND type = ?',
            [blogId, userId, type]
        );

        if (existing.length > 0) {
            await db.query('DELETE FROM blog_reactions WHERE id = ?', [existing[0].id]);
            res.json({ message: 'Reaction removed' });
        } else {
            await db.query(
                'INSERT INTO blog_reactions (blog_id, user_id, type) VALUES (?, ?, ?)',
                [blogId, userId, type]
            );
            res.json({ message: 'Reaction added' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin/Editor functions
export const getPendingBlogs = async (req, res) => {
    try {
        const [blogs] = await db.query(
            'SELECT b.*, u.fname, u.lname FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.status = ?',
            ['pending']
        );
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBlogStatus = async (req, res) => {
    const { id, status } = req.body; // status: 'accepted' or 'rejected'
    try {
        await db.query('UPDATE blogs SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Blog ${status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
