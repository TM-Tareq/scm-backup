import db from '../db.js';

export const addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    try {
        // Check if user already reviewed this product
        const [existing] = await db.query(
            'SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?',
            [productId, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        await db.query(
            'INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [productId, userId, rating, comment]
        );

        // Update average rating for the product
        const [avg] = await db.query(
            'SELECT AVG(rating) as averageRating FROM product_reviews WHERE product_id = ?',
            [productId]
        );

        await db.query(
            'UPDATE products SET rating = ? WHERE id = ?',
            [avg[0].averageRating, productId]
        );

        res.status(201).json({ message: 'Review added successfully', averageRating: avg[0].averageRating });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    try {
        const [reviews] = await db.query(
            `SELECT r.*, u.fname, u.lname 
             FROM product_reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC`,
            [productId]
        );
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
