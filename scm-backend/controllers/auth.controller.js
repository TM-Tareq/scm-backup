import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

export const register = async(req, res)=> {
    const { fname, lname, email, password, confirmPassword } = req.body;

    if(!fname || !email || !password) {
        return res.status(400).json({ message:'First name, email and password required'});
    }
    if(password !== confirmPassword) {
        return res.status(400).json({message: 'Password do not match'})
    };

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if(existing.length > 0) return res.status(400).json({ message: 'Email already exists'});

        const password_hash = await bcrypt.hash(password, 12);

        const [result] = await db.query('INSERT INTO users (fname, lname, email, password_hash) VALUES (?, ?, ?, ?)', [fname, lname, email, password_hash]);

        // id of a new user
        const userId = result.insertId;

        // taking user data
        const [newUser] = await db.query('SELECT id, fname, lname, email FROM users WHERE id = ?', [userId]);
        const user = newUser[0];

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE}
        );

        res.status(201).json({message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email
            }
        });
    } catch(error) {
        console.error('Registration error: ', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

export const login = async(req, res)=> {
    const {email, password} = req.body;
    
    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password required'});
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if(users.length === 0) return res.status(401).json({ message: 'Invalid credentials'});

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
            }
        });
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Server error'});
    }
}

export const getCurrentUser = async(req, res)=> {
    try {
        const userId = req.user.id;

        const[user] = await db.query(
            'SELECT id, fname, lname, email FROM users WHERE id= ?', [userId]
        );

        if(user.length === 0) {
            return res.status(400).json({ message: 'User not found'});
        }

        res.json({
            user: user[0]
        });
    } catch(error) {
        console.error('Get current user error: ', error);
        res.status(500).json({ message: 'Server error'});
    }
};    









// nice
// controllers/auth.controller.js ফাইলটা সাধারণত একটা Node.js + Express প্রজেক্টে থাকে (বা যেকোনো MERN/MEAN/MEVN স্ট্যাকের প্রজেক্টে)। এটার মূল কাজ হলো Authentication (লগইন, সাইনআপ, পাসওয়ার্ড রিসেট ইত্যাদি) সম্পর্কিত সব লজিক হ্যান্ডেল করা।