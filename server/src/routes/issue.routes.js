import { Router } from "express";
import { 
    createIssue, 
    getAllIssues, 
    updateIssueStatus, 
    deleteIssue 
} from "../controllers/issue.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Sabhi Routes ko Secure banane ke liye
router.use(verifyJWT); 

// 1. Create Route: Iska naam '/create' kar diya taaki Frontend se match kare ✅
// Frontend ab is raste par aayega: http://localhost:5000/api/v1/issues/create
router.route("/create").post(createIssue);

// 2. Get All Route: Ise '/get-issues' hi rehne do (Frontend MyTasks se match kar raha hai) ✅
router.route("/get-issues").get(getAllIssues);

// 3. Update Status Route
router.route("/status/:issueId").patch(updateIssueStatus);

// 4. Delete Route
router.route("/delete/:issueId").delete(deleteIssue);

export default router;