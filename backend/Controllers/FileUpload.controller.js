import { File as FileModel } from '../models/File.js';
import { User } from '../models/User.js';
import fs from 'fs/promises';
import path from 'path';

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided.' });

  const { userId, companyId, Monthly_Upload_query } = req.user;

  if (Monthly_Upload_query >= process.env.MONTHLY_UPLOAD_LIMIT) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ error: 'Monthly Upload Limit Reached!' });
  }

  try {
    const destinationDir = path.join(process.cwd(), 'uploads', 'documents', String(companyId));
    await fs.mkdir(destinationDir, { recursive: true });

    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
    const finalPath = path.join(destinationDir, fileName);
    
    // Create the relative path for the DB
    const relativeStoragePath = path.join('documents', String(companyId), fileName);

    await fs.rename(req.file.path, finalPath);

    const newFile = await FileModel.create({
      original_name: req.file.originalname,
      mime_type: req.file.mimetype,
      size: req.file.size,
      storage_path: relativeStoragePath, // Store ONLY the relative path
      company_id: companyId,
      user_id: userId,
      status: 'Synced',
      is_encrypted: false,
    });

    await User.increment({ Monthly_Upload_Query: 1 }, { where: { id: userId, company_id: companyId } });

    return res.status(201).json({
      message: 'Asset secured in Local Vault.',
      data: { id: newFile.id, name: newFile.original_name, url: relativeStoragePath },
    });
  } catch (error) {
    console.error('Local Sync Error:', error);
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({ error: 'Sync failed.' });
  }
};