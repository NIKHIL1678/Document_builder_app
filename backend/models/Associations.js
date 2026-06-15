import {User} from './User.js'
import { File } from './File.js';
import { Company } from './Company.js';
import { Document } from './Document.js';
import { DocumentShare } from './DocumentShare.js';

// --- DOCUMENT OWNERSHIP ---
User.hasMany(Document, { foreignKey: 'owner_id', as: 'OwnedDocuments' });
Document.belongsTo(User, { foreignKey: 'owner_id', as: 'Owner' });

// --- DOCUMENT SHARING (RBAC) ---
Document.hasMany(DocumentShare, { foreignKey: 'document_id', as: 'Shares' });
DocumentShare.belongsTo(Document, { foreignKey: 'document_id' });

User.hasMany(DocumentShare, { foreignKey: 'shared_with_user_id', as: 'SharedAccess' });
DocumentShare.belongsTo(User, { foreignKey: 'shared_with_user_id', as: 'SharedUser' });

// --- FILE TO DOCUMENT LINKAGE ---
File.hasOne(Document, { foreignKey: 'source_file_id' });
Document.belongsTo(File, { foreignKey: 'source_file_id' });