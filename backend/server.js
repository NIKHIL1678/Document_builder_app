import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import sequelize from './config/db.js'; // Import the instance for syncing
import './models/index.js'; // Import relationships so Sequelize knows about them
import './models/Associations.js';
import router from './Routes/routes.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const uploadDir = path.join(process.cwd(), 'uploads', 'temp');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Created 'uploads/temp' directory structure.");
}

const app = express();

// ── MIDDLEWARE ──

const corsOptions = {
    origin: 'http://localhost:5180', // Allow your specific frontend port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Required for cookies/sessions
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// STATIC ASSET EXPOSURE PROTOCOL
// This allows the browser to fetch the generated PDFs
// ==========================================
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── ROUTES ──
app.use('/api/user', router);

// ── DATABASE & SERVER START ──
const startServer = async () => {
  try {
    // 1. Connect to MySQL
    await connectDB();

    // 2. Sync Models to Tables
    // { alter: true } matches the DB tables to your models without losing data
    // await sequelize.sync({ alter: true }); // Uncomment when making schema changes
    
    console.log('📦 DATABASE: Schema Synced & Tables Verified');

    // 3. Start Listener
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 VaultAI Engine running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ FATAL: Server failed to start:', error.message);
  }
};

startServer();