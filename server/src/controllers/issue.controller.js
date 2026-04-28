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
            // --- FIX: CAPS mein rakha hai taaki Model validation fail na ho ---
            priority: priority ? priority.toUpperCase() : "MEDIUM",
            status: "TODO", // ✅ Pehle yahan "todo" tha, ab "TODO" hai
            creator: req.user._id, 
            project: project 
        });

        const createdIssue = await Issue.findById(issue._id).populate("creator", "username fullName email");

        return res.status(201).json({
            success: true,
            data: createdIssue,
            message: "Referral/Issue created successfully! 🚀"
        });
    } catch (error) {
        // error.message mein ab validation error nahi aayega
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

// --- UPDATE ISSUE STATUS (PATCH) ---
const updateIssueStatus = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { status } = req.body; 

        if (!status) return res.status(400).json({ message: "Status is required" });

        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            // --- FIX: Status ko hamesha CAPS mein save karo ---
            { $set: { status: status.toUpperCase() } }, 
            { new: true }
        );

        if (!updatedIssue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        return res.status(200).json({
            success: true,
            data: updatedIssue,
            message: `Status updated to ${status.toUpperCase()}!`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- DELETE ISSUE (DELETE) ---
const deleteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        await Issue.findByIdAndDelete(issueId);
        return res.status(200).json({ success: true, message: "Issue deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { createIssue, getAllIssues, updateIssueStatus, deleteIssue };