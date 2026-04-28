import { Router } from "express";
import { 
    registerUser, 
    loginUser,
    updateAccount,
    getCurrentUser,
    uploadAvatar // 👈 Naya controller function
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js"; // 👈 Multer middleware import karo

const router = Router();

// --- Public Routes ---
// Route: http://localhost:5000/api/v1/users/register
router.route("/register").post(registerUser);

// Route: http://localhost:5000/api/v1/users/login
router.route("/login").post(loginUser);


// --- Protected Routes (Authentication Required) ---

// Get current logged-in user data
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Update profile text details (Name, Bio, etc.)
router.route("/update-account").put(verifyJWT, updateAccount);

// 🚀 Professional Avatar Upload Route
// verifyJWT: Sirf logged-in users hi photo badal sakein
// upload.single("avatar"): Multer "avatar" field se file pick karega
router.route("/upload-avatar").post(
    verifyJWT, 
    upload.single("avatar"), 
    uploadAvatar
);

export default router;