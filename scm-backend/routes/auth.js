import e from "express";
import { register, login, getCurrentUser } from "../controllers/auth.controller.js";
import { addToCart, getCart, getCartCount, removeFromCart } from "../controllers/cart.controller.js";
import { addToWishlist, getWishlist, getWishlistCount, removeFromWishlist } from "../controllers/wishlist.controller.js";

// Middleware
import { authenticateToken } from "../src/middleware/auth.js";

const router = e.Router();

// user routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);

// cart routes
router.get('/cart', authenticateToken, getCart)
router.post('/cart/add', authenticateToken, addToCart);
router.post('/cart/remove', authenticateToken, removeFromCart)
router.get('/cart/count', authenticateToken, getCartCount);


// wish routes
router.get('/wishlist', authenticateToken, getWishlist);
router.post('/wishlist/add', authenticateToken, addToWishlist);
router.post('/wishlist/remove', authenticateToken, removeFromWishlist)
router.get('/wishlist/count', authenticateToken, getWishlistCount);

export default router;