import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const DocumentShare = sequelize.define('DocumentShare', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  document_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  shared_with_user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  permission_level: {
    type: DataTypes.ENUM('read', 'edit'),
    defaultValue: 'read',
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'document_shares',
  indexes: [
    {
      unique: true,
      fields: ['document_id', 'shared_with_user_id'],
      name: 'unique_document_share' // Prevents duplicate access grants
    }
  ]
});