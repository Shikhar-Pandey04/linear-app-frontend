import { Router } from "express";
import { 
    createIssue, 
    getAllIssues, 
    updateIssueStatus, 
    deleteIssue 
} from "../controllers/issue.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// --- Sabhi Routes ko Secure banane ke liye ---
router.use(verifyJWT); 

// 1. Create Route: Iska naam '/create-issue' kar diya taaki Modal se match kare
// URL: http://localhost:5000/api/v1/issues/create-issue
router.route("/create-issue").post(createIssue);

// 2. Get All Route: Iska naam '/get-issues' kar diya taaki MyTasks/Overview se match kare
// URL: http://localhost:5000/api/v1/issues/get-issues
router.route("/get-issues").get(getAllIssues);

// 3. Update Status Route
// URL: http://localhost:5000/api/v1/issues/status/:issueId
router.route("/status/:issueId").patch(updateIssueStatus);

// 4. Delete Route
// URL: http://localhost:5000/api/v1/issues/delete/:issueId
router.route("/delete/:issueId").delete(deleteIssue);

export default router;