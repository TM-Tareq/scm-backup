import db from '../db.js';

export const addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    try {
        // 1. Verify user purchased the product
        // For COD: Order must be 'delivered'
        // For Online Payment: Order can be 'processing', 'shipped', 'delivered' (since they already paid)

        const [purchaseCheck] = await db.query(`
            SELECT o.id 
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ? 
            AND oi.product_id = ?
            AND (
                (o.payment_method = 'cod' AND o.status = 'delivered')
                OR 
                (o.payment_method IN ('bkash', 'nagad', 'credit_card', 'paypal') AND o.status IN ('processing', 'shipped', 'delivered'))
            )
            LIMIT 1
        `, [userId, productId]);

        if (purchaseCheck.length === 0) {
            return res.status(403).json({
                message: 'You can only review products you have purchased. For Cash on Delivery, please wait until delivery is confirmed.'
            });
        }

        // Allow review (removing the "existing" check allows multiple reviews if they want)

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
