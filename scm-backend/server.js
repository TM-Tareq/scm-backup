import e from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = e();

// establishing middleware
app.use(cors());
app.use(e.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});
