import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the temp directory exists
const tempDir = 'uploads/temp';
if (!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Save with a unique name so concurrent uploads don't clash
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });