import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // --- THE MULTI-TENANT CORE ---
  company_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  // -----------------------------
  original_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  storage_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ai_summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  embedding: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_encrypted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true, 
  underscored: true,
  tableName: 'files'
});