import { Router } from "express";
import { 
    registerUser, 
    loginUser,
    updateAccount,
    getCurrentUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Route: http://localhost:5000/api/v1/users/register
router.route("/register").post(registerUser);

// Route: http://localhost:5000/api/v1/users/login
router.route("/login").post(loginUser);

// Protected Routes - Authentication required
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").put(verifyJWT, updateAccount);

export default router;