import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Received Auth Header:", authHeader);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if(!token) {
        return res.status(401).json({ message: 'No token provided'});
    }

    console.log("Token extracted:", token.substring(0, 20) + "...");

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=> {
        if(err) {
            console.log("JWT Verify Error:", err.name, err.message);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    });
};