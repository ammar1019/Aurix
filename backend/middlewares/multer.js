
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensuring the 'uploads' folder exists. This is where files will be saved temporarily.
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Creating a storage configuration for multer
// This defines where and how the uploaded files will be stored on the server
const storage = multer.diskStorage({
  // 'destination' tells multer where to save the uploaded files
  destination: (req, file, cb) => {
    cb(null, uploadDir); // files will be saved to the 'uploads' folder
  },

  // 'filename' decides what name to give the uploaded file once it's saved
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // extracts file extension like .jpg or .png
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`; // creates a unique file name
    cb(null, uniqueName); // saves the file with the unique name
  },
});

// Creating an upload middleware using the storage configuration above
// This middleware will be used in routes where we need to handle file uploads
const upload = multer({ storage });

// Exporting the upload middleware
export default upload;