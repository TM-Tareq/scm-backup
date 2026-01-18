import db from '../db.js';

export const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    
    const userId = req.user.id;

    try {
        const [existing] = await db.query(
            'SELECT id FROM wish_lists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already in wishlist' });
        }

        await db.query(
            'INSERT INTO wish_lists (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );

        res.status(200).json({ message: 'Added to wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        await db.query(
            'DELETE FROM wish_lists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        res.status(200).json({ message: 'Removed from wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getWishlist = async (req, res) => {
    const userId = req.user.id;

    try {
        const [items] = await db.query(
            'SELECT w.*, p.name, p.price, p.image, p.id as product_id ' +
            'FROM wish_lists w ' +
            'JOIN products p ON w.product_id = p.id ' +
            'WHERE w.user_id = ?',
            [userId]
        );

        res.json({ wishlist: items });
    } catch (err) {
        console.error('Get wishlist error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getWishlistCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const [result] = await db.query(
            'SELECT COUNT(*) AS count FROM wish_lists WHERE user_id = ?',
            [userId]
        );
        res.json({ count: result[0].count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};