import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js";
import vendorRoutes from "./routes/vendor.js";
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import blogRoutes from "./routes/blog.js";
import chatRoutes from "./routes/chat.js";
import reviewRoutes from "./routes/review.js";

dotenv.config();

const app = express();

// establishing middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
