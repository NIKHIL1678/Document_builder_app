import express from 'express';
import { uploadFile } from '../Controllers/FileUpload.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';
import { UserRegistration } from '../Controllers/UserRegistrations.controller.js';
import { UserLogin } from '../Controllers/UserLogin.controller.js';
import { DashboardSummary } from '../Controllers/Dashboard.controller.js';


import { 
    handleDocumentInitialization, 
    getDocument, 
    updateDocument 
} from '../controllers/document.controller.js';


import { 

    getAllFiles,
    getFileById,
    deleteFileById,

} from '../Controllers/Files.controllers.js';


const router = express.Router();

/**
 * @route   POST /api/vault/upload
 * @desc    Securely upload a document to the landing zone with tenant isolation
 * @access  Private (Requires JWT)
 * * DESIGN PATTERN:
 * 1. authenticate: Extracts companyId from the JWT to ensure multi-tenancy.
 * 2. upload.single: Handles the multipart/form-data and streams it to the disk.
 * 3. uploadFile: Final controller to index the file in MySQL.
 */
router.get('/dashboardsummary', authenticate, DashboardSummary);
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  uploadFile
);
router.post('/register', UserRegistration);
router.post('/login', UserLogin);

// Files Controllers Routes

router.get('/files/all', authenticate, getAllFiles);
router.get('/file/:id', authenticate, getFileById);
router.delete('/file/:id', authenticate, deleteFileById);

// Documents Controllers Routes

router.post('/documents/initialize', authenticate, handleDocumentInitialization);

// Get Single Document by ID
router.get('/documents/:id', authenticate, getDocument);

// Update Single Document by ID
router.put('/documents/:id', authenticate, updateDocument);

export default router;