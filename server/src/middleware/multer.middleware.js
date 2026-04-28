import multer from "multer";
import path from "path";

// File storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ye folder hum Step 3 mein banayenge
        cb(null, "./public/temp") 
    },
    filename: function (req, file, cb) {
        // File ka naam unique rakhne ke liye timestamp add kar sakte ho
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

// File filter (Optional: Sirf images allow karne ke liye)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});