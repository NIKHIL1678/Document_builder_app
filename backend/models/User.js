import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [2, 50] }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company_id: {
    type: DataTypes.UUID, // Changed to UUID to match Company model
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.TEXT, // Used to store the current refresh token for rotation
    allowNull: true
  },
  storage_limit: {
    type: DataTypes.BIGINT,
    defaultValue: 5368709120
  },
  Monthly_View_Query :{
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue : 0,
  },
  Monthly_Upload_Query : {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue : 0,
  },
}, {
  defaultScope: {
    attributes: { exclude: ['password', 'refresh_token'] }
  },
  scopes: {
    withPassword: { attributes: {} }
  },
  // --- HOOKS: THE AUTOMATION LAYER ---
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// --- PROTOTYPE METHODS: THE LOGIC LAYER ---
// Method to check if password is correct
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};