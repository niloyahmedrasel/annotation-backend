import multer from "multer";
import path from "path";
import { Request } from "express";

// Set up storage with multer
const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, path.join(__dirname, "../../public/upload")); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  }
});

// Define the file filter for different file types
const fileFilter = (req: Request, file: any, cb: any) => {
  // Define allowed file types
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

// Multer instance with the updated storage and fileFilter
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: fileFilter,
});

export default upload;
