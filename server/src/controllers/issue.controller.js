import { Issue } from "../models/Issue.model.js";

// --- CREATE ISSUE (POST) ---
const createIssue = async (req, res) => {
    try {
        const { title, description, priority, project } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }

        const issue = await Issue.create({
            title,
            description,
            // Priority ko CAPS mein rakha hai validation ke liye
            priority: priority ? priority.toUpperCase() : "MEDIUM",
            status: "TODO", 
            creator: req.user._id, 
            project: project 
        });

        const createdIssue = await Issue.findById(issue._id).populate("creator", "username fullName email");

        return res.status(201).json({
            success: true,
            data: createdIssue,
            message: "Issue created successfully! 🚀"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
// Note: Iska naam 'updateIssueStatus' hi rakha hai kyunki tere routes mein yahi use ho raha hai
const updateIssueStatus = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { title, description, priority, status } = req.body; 

        // 1. Check karo issue exist karta hai ya nahi
        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        // 2. Update logic: Agar body mein data hai toh wo lo, warna purana rehne do
        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            {
                $set: {
                    title: title || issue.title,
                    description: description || issue.description,
                    priority: priority ? priority.toUpperCase() : issue.priority,
                    status: status ? status.toUpperCase() : issue.status,
                }
            },
            { new: true }
        ).populate("creator", "username fullName");

        return res.status(200).json({
            success: true,
            data: updatedIssue,
            message: "Issue updated successfully! 🚀"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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