import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    domain: {
        type: DataTypes.STRING, 
        unique: true,
        allowNull: false // e.g., 'google.com' or 'infosys.in'
    },
    logo_url: {
        type: DataTypes.STRING,
        allowNull: true // Store the S3 URL here
    },
    subscription_status: {
        type: DataTypes.ENUM('trial', 'active', 'suspended'),
        defaultValue: 'trial'
    },
    contact_email: {
        type: DataTypes.STRING,
        validate: { isEmail: true }
    },
    // Compliance fields for ZipzyLaw
    registration_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true, // Auto-creates createdAt and updatedAt
    tableName: 'companies'
});
