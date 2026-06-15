import crypto from 'crypto';

/**
 * Generates a high-entropy 64-character hex string.
 * This is the standard for HS256 JWT signing.
 */
const generateSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};

console.log("--- 🔑 YOUR SECURE VAULT KEYS 🔑 ---");
console.log("JWT_ACCESS_SECRET=" + generateSecret());
console.log("JWT_REFRESH_SECRET=" + generateSecret());
console.log("------------------------------------");
console.log("Copy these into your .env file and RESTART your server.");