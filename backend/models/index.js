import { User } from './User.js';
import { File } from './File.js';
import { Company } from './Company.js';

// -----------------------------
// USER ↔ FILE
// -----------------------------

User.hasMany(File, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

File.belongsTo(User, {
  foreignKey: 'user_id'
});

// -----------------------------
// COMPANY ↔ USER
// -----------------------------

Company.hasMany(User, {
  foreignKey: 'company_id',
  as: 'employees'
});

User.belongsTo(Company, {
  foreignKey: 'company_id'
});

// -----------------------------
// COMPANY ↔ FILE
// -----------------------------

Company.hasMany(File, {
  foreignKey: 'company_id'
});

File.belongsTo(Company, {
  foreignKey: 'company_id'
});

export { User, File, Company };