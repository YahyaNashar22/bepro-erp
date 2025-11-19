import { createMulterUpload } from "../middlewares/multer.js";

// upload single file to quotations folder
const quotationUpload = createMulterUpload("quotations").single("file");

// upload single file to images folder
const imageUpload = createMulterUpload("images").single("file");

// controller for quotations
export const uploadQuotationController = (req, res) => {
    quotationUpload(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: "Upload failed", error: error.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }
        // return file link
        const fileUrl = `uploads/quotations/${req.file.filename}`;
        return res.status(200).json({ message: "File uploaded", payload: fileUrl })
    });
};

// controller for images
export const uploadImageController = (req, res) => {
    imageUpload(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: "Upload failed", error: error.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }
        // return file link
        const fileUrl = `/uploads/images/${req.file.filename}`;
        return res.status(200).json({ message: "File uploaded", payload: fileUrl });
    });
};