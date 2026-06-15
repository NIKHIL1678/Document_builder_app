import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const UserLogin = async (req, res) => {
    console.log("--- 🔐 Login Attempt Received ---");

    const { email, password } = req.body;

    try {
        // 1. Find the user including the hidden password field
        // We use the 'withPassword' scope we defined in the model
        const user = await User.scope('withPassword').findOne({ where: { email } });

        // 2. Security: Check if user exists AND password matches
        // Using our prototype method user.comparePassword()
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        console.log(" User: ", user);
        // 3. Generate Access Token (Short-lived)
        const accessToken = jwt.sign(
            {
                id: user.id,
                companyId: user.company_id,
                role: user.role,
                Monthly_Upload_Query: user.Monthly_Upload_Query,
                Monthly_View_Query: user.Monthly_View_Query,
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        // 4. Generate Refresh Token (Long-lived)
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Sync Refresh Token to DB for session tracking
        user.refresh_token = refreshToken;
        await user.save();

        // 6. Set Refresh Token in HttpOnly Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        // 7. Final Success Response
        return res.status(200).json({
            message: "Welcome back!",
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                company_id: user.company_id,
                Monthly_Upload_Query: user.Monthly_Upload_Query,
                Monthly_View_Query: user.Monthly_View_Query,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
};