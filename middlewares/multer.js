import multer from "multer";
import path from "path";
import fs from "fs";


// Create storage directly based on folder
export const getMulterStorage = (folder) => {
    const uploadPath = path.join(__dirname, "../uploads", folder);

    // ensure folder exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    return multer.diskStorage(
        {
            destination: (_req, _file, cb) => {
                cb(null, uploadPath);
            },
            filename: (_req, file, cb) => {
                const fileExtension = path.extname(file.originalname);
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
                cb(null, fileName);
            }
        }
    );
};


// Create multer upload instance for a folder
export const createMulterUpload = (folder) => {
    return multer({ storage: getMulterStorage(folder) });
}