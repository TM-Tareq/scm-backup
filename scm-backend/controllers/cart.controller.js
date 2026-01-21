import db from '../db.js'


export const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id; // it comes form authentication token

    try {
        let [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        let cartId;

        // if does not have any product
        if (cart.length === 0) {
            const [result] = await db.query('INSERT INTO carts (user_id, total_price) VALUES (?, 0.00)', [userId]);
            cartId = result.insertId;
        } else {
            cartId = cart[0].id;
        }
        // checking if any product already exsisting
        const [existing] = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

        if (existing.length > 0) {
            await db.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
        } else {
            await db.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_add) VALUES (?, ?, ?, (SELECT price FROM products WHERE id=?))',
                [cartId, productId, quantity, productId]
            );
        }

        res.status(200).json({ message: 'Added to cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (cart.length === 0) return res.status(404).json({ message: 'Cart not found' });

        const cartId = cart[0].id;

        const [existing] = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Product not in cart' });
        }

        if (existing[0].quantity > 1) {
            await db.query('UPDATE cart_items SET quantity = quantity - 1 WHERE id = ?', [existing[0].id]);
        } else {
            await db.query('DELETE FROM cart_items WHERE id = ?', [existing[0].id]);
        }

        res.status(200).json({ message: 'Cart updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (cart.length === 0) res.json({ cartItems: [] });

        const cartId = cart[0].id;

        const [items] = await db.query(
            'SELECT ci.*, p.name, p.price, p.image FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?',
            [cartId]
        );
        res.json({ cartItems: items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sever error' });
    }
};

export const getCartCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const [result] = await db.query(
            'SELECT COUNT(*) AS count FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?', [userId]);
        res.json({ count: result[0].count })
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}
