import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

/**
 * PRODUCTION-LEVEL SEQUELIZE CONFIGURATION
 * We use a connection pool to manage multiple simultaneous requests efficiently.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Set to console.log during debugging if needed
    pool: {
      max: 10,           // Maximum number of connection in pool
      min: 0,            // Minimum number of connection in pool
      acquire: 30000,    // Maximum time (ms) that pool will try to get connection before throwing error
      idle: 10000        // Maximum time (ms) that a connection can be idle before being released
    },
    retry: {
      max: 3             // Retry connection 3 times if it fails initially
    }
  }
);

/**
 * Database Connection Test Function
 */
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('-------------------------------------------');
    console.log('✅ INFRASTRUCTURE: MySQL Connection Secure');
    console.log(`📡 HOST: ${process.env.DB_HOST}`);
    console.log('-------------------------------------------');
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Unable to connect to MySQL:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default sequelize;