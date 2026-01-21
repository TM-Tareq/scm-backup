import e from "express";
import { register, login, getCurrentUser, updateProfile } from "../controllers/auth.controller.js";
import { addToCart, getCart, getCartCount, removeFromCart } from "../controllers/cart.controller.js";
import { addToWishlist, getWishlist, getWishlistCount, removeFromWishlist } from "../controllers/wishlist.controller.js";

// Middleware
import { verifyToken } from "../middleware/authMiddleware.js";

const router = e.Router();

// user routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getCurrentUser);
router.put('/profile-update', verifyToken, updateProfile);

// cart routes
router.get('/cart', verifyToken, getCart)
router.post('/cart/add', verifyToken, addToCart);
router.post('/cart/remove', verifyToken, removeFromCart)
router.get('/cart/count', verifyToken, getCartCount);


// wish routes
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist/add', verifyToken, addToWishlist);
router.post('/wishlist/remove', verifyToken, removeFromWishlist)
router.get('/wishlist/count', verifyToken, getWishlistCount);

export default router;