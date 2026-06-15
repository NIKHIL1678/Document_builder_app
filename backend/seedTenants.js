import sequelize from './config/db.js';
import { Company } from './models/Company.js';
import { User } from './models/User.js';

const createInitialTenant = async () => {
  try {
    // DB Connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync models
    await sequelize.sync();

    // -----------------------------
    // CREATE COMPANY / TENANT
    // -----------------------------
    const company = await Company.create({
      name: 'Cloud Storage Pvt Ltd',
      domain: 'cloudstorage.com',
      logo_url: null,
      subscription_status: 'active',
      contact_email: 'admin@cloudstorage.com',
      registration_number: 'REG-2026-001',
      address: 'Delhi, India'
    });

    console.log('Company created:', company.id);

    // -----------------------------
    // CREATE ADMIN USER
    // -----------------------------
    const user = await User.create({
      name: 'Super Admin',
      email: 'admin@cloudstorage.com',
      password: 'Admin@123', // Will auto hash because of hook
      company_id: company.id,
      storage_limit: 5368709120
    });

    console.log('Admin user created:', user.id);

    console.log('Tenant setup completed successfully.');

    process.exit(0);

  } catch (error) {
    console.error('Error creating tenant:', error);
    process.exit(1);
  }
};

createInitialTenant();