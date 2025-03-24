import multer from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";

// Configure disk storage to save files locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.join(process.cwd(), 'public', 'upload');
    // Create directory if it doesn't exist
    fs.mkdirSync(destPath, { recursive: true });
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req: Request, file: any, cb: any) => {
  const imageTypes = /jpeg|jpg|png|gif/;
  const documentTypes = /pdf|doc|docx/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (file.fieldname === "bookCover" && imageTypes.test(extname) && imageTypes.test(mimetype)) {
    return cb(null, true); // Accept images for bookCover
  } else if (file.fieldname === "bookFile" && documentTypes.test(extname) && documentTypes.test(mimetype)) {
    return cb(null, true); // Accept documents for bookFile
  } else {
    return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed formats: Images (jpg, png) for bookCover & Documents (pdf, doc) for bookFile.`));
  }
};

const upload = multer({
  storage: storage, // Use diskStorage
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

export default upload;