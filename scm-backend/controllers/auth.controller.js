import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

export const register = async (req, res) => {
    const { fname, lname, email, password, confirmPassword, role = 'customer' } = req.body;

    if (!fname || !email || !password) {
        return res.status(400).json({ message: 'First name, email and password required' });
    }
    if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' })
    };

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });

        const password_hash = await bcrypt.hash(password, 12);

        const [result] = await db.query('INSERT INTO users (fname, lname, email, password_hash, role) VALUES (?, ?, ?, ?, ?)', [fname, lname, email, password_hash, role]);

        // id of a new user
        const userId = result.insertId;

        // taking user data
        const [newUser] = await db.query('SELECT id, fname, lname, email, role FROM users WHERE id = ?', [userId]);
        const user = newUser[0];

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                role: user.role,
                image_url: user.image_url
            }
        });
    } catch (error) {
        console.error('Registration error: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                role: user.role,
                image_url: user.image_url
            }
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const [user] = await db.query(
            'SELECT id, fname, lname, email, COALESCE(role, "customer") AS role, image_url FROM users WHERE id= ?', [userId]
        );

        if (user.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Ensure role is set correctly (default to customer if null/undefined)
        const userData = user[0];
        if (!userData.role || userData.role === 'null' || userData.role === null) {
            userData.role = 'customer';
        }

        res.json({
            user: userData
        });
    } catch (error) {
        console.error('Get current user error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    const { fname, lname, email } = req.body;
    const userId = req.user.id;
    const image_url = req.file ? req.file.path.replace(/\\/g, '/') : null;

    try {
        if (image_url) {
            await db.query(
                'UPDATE users SET fname = ?, lname = ?, email = ?, image_url = ? WHERE id = ?',
                [fname, lname, email, image_url, userId]
            );
        } else {
            await db.query(
                'UPDATE users SET fname = ?, lname = ?, email = ? WHERE id = ?',
                [fname, lname, email, userId]
            );
        }

        const [updatedUser] = await db.query(
            'SELECT id, fname, lname, email, COALESCE(role, "customer") AS role, image_url FROM users WHERE id = ?',
            [userId]
        );

        // Ensure role is set correctly
        const userData = updatedUser[0];
        if (!userData.role || userData.role === 'null' || userData.role === null) {
            userData.role = 'customer';
        }

        res.json({
            message: 'Profile updated successfully',
            user: userData
        });
    } catch (error) {
        console.error('Update profile error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};









// nice
// controllers/auth.controller.js ফাইলটা সাধারণত একটা Node.js + Express প্রজেক্টে থাকে (বা যেকোনো MERN/MEAN/MEVN স্ট্যাকের প্রজেক্টে)। এটার মূল কাজ হলো Authentication (লগইন, সাইনআপ, পাসওয়ার্ড রিসেট ইত্যাদি) সম্পর্কিত সব লজিক হ্যান্ডেল করা।