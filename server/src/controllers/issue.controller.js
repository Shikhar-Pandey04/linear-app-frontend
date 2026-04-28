import { Issue } from "../models/Issue.model.js";

// --- CREATE ISSUE (POST) ---
const createIssue = async (req, res) => {
    try {
        const { title, description, priority, project } = req.body;

        // 1. Sirf Title aur Description check karo
        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }

        // --- PROJECT CHECK HATA DIYA HAI ---
        // Ab agar project ID nahi bhi aayegi, toh task ban jayega

        const issue = await Issue.create({
            title,
            description,
            // Model ke hisaab se lowercase mein save karte hain
            priority: priority ? priority.toLowerCase() : "medium",
            status: "todo", 
            creator: req.user._id, 
            project: project || null // Agar project nahi hai toh null chala jayega
        });

        const createdIssue = await Issue.findById(issue._id).populate("creator", "username fullName email");

        return res.status(201).json({
            success: true,
            data: createdIssue,
            message: "Issue created successfully! 🚀"
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- GET ALL ISSUES (GET) ---
const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find()
            .populate("creator", "username fullName")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: issues.length,
            data: issues
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- UPDATE ISSUE (PATCH) ---
const updateIssueStatus = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { title, description, priority, status } = req.body; 

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            {
                $set: {
                    title: title || issue.title,
                    description: description || issue.description,
                    priority: priority ? priority.toLowerCase() : issue.priority,
                    status: status ? status.toLowerCase() : issue.status,
                }
            },
            { new: true, runValidators: true } 
        ).populate("creator", "username fullName");

        return res.status(200).json({
            success: true,
            data: updatedIssue,
            message: "Issue updated successfully! 🚀"
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- DELETE ISSUE (DELETE) ---
const deleteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        
        const deletedIssue = await Issue.findByIdAndDelete(issueId);
        
        if (!deletedIssue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Issue deleted successfully" 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { createIssue, getAllIssues, updateIssueStatus, deleteIssue };