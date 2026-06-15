import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    // 1. Get token from header (Format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        // 3. Attach user info to the request object
        // Now, in any following route, you can use req.user.id

        req.user = {
            userId: decoded.id,
            companyId: decoded.companyId, // <--- CRITICAL for Multi-tenancy
            role: decoded.role,
            Monthly_Upload_query: decoded.Monthly_Upload_Query,
            Monthly_View_query: decoded.Monthly_View_Query,
        }; 

        console.log("Req User :", req.user);
        
        next(); // Move to the next middleware or controller
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};