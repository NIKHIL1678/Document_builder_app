import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false,

    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Untitled Document'
    },
    content: {
        type: DataTypes.JSON, // Optimized for storing rich-text state arrays
        allowNull: true
    },
    source_file_id: {
        // Changing from DataTypes.UUID or default STRING to STRING(515) or TEXT
        type: DataTypes.STRING(515),
        allowNull: true // Keeping it flexible for blank canvas documents
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'documents'
});