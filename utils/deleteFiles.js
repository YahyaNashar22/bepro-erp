import fs from "fs";
import path from "path";
import url from "url";

const getLocalPath = (filePath) => {
    if (!filePath) return null;

    try {
        // If full URL → extract pathname
        if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
            const parsed = url.parse(filePath);
            filePath = parsed.pathname; // "/uploads/images/image-1.png"
        }

        // Remove leading "/" to avoid absolute root issues
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }

        // Build actual disk path
        const fullPath = path.join(process.cwd(), filePath);

        return fullPath;
    } catch {
        return null;
    }
};

export const deleteFiles = async (files = []) => {
    if (!Array.isArray(files)) return;

    for (const file of files) {
        const fullPath = getLocalPath(file);
        if (!fullPath) continue;

        try {
            if (fs.existsSync(fullPath)) {
                await fs.promises.unlink(fullPath);
                console.log("Deleted File:", fullPath);
            } else {
                console.warn("File not found:", fullPath);
            }
        } catch (err) {
            console.error("Error deleting file:", file, err.message);
        }
    }
};

export const deleteFile = async (filePath) => {
    const fullPath = getLocalPath(filePath);
    if (!fullPath) return;

    try {
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
            console.log("Deleted File:", fullPath);
        } else {
            console.warn("File not found:", fullPath);
        }
    } catch (err) {
        console.error("Error deleting file:", filePath, err.message);
    }
};
