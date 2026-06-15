import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const UserRegistration = async (req, res) => {
    console.log("--- New Registration Request Received ---");

    // 1. Destructure with default company_id for testing (or from body)
    // Note: 'password' spelling corrected from 'pasword'
    const { name, email, password } = req.body;

    try {
        // 2. Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        // 3. Create User 
        // The password will be automatically hashed by our Sequelize 'beforeSave' hook!
        const newUser = await User.create({
            name,
            email,
            password,
            company_id : 'ec04e34c-421b-11f1-9bfd-10e7c671b1a9'
        });

        // 4. Generate Tokens (Access + Refresh)
        const accessToken = jwt.sign(
            { id: newUser.id, companyId: newUser.company_id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: newUser.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Store Refresh Token in DB for session management
        newUser.refresh_token = refreshToken;
        await newUser.save();

        // 6. Set Refresh Token in HttpOnly Cookie (Security Best Practice)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 7. Success Response
        return res.status(201).json({
            message: "User registered successfully",
            accessToken, // Send access token in body
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration Error: ", error);
        return res.status(500).json({
            message: "Failed to register user",
            error: error.message
        });
    }
};