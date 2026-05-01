import { Issue } from "../models/Issue.model.js";

// --- CREATE ISSUE (POST) ---
const createIssue = async (req, res) => {
  try {
    const { title, description, priority, project } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const issue = await Issue.create({
      title: title.trim(),
      description: description?.trim() || "",
      priority: priority ? priority.toLowerCase() : "medium",
      status: "todo",
      creator: req.user._id,
      project: project || null
    });

    const createdIssue = await Issue.findById(issue._id)
      .populate("creator", "username fullName email");

    return res.status(201).json({
      success: true,
      data: createdIssue,
      message: "Issue created successfully!"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// --- GET ONLY LOGGED-IN USER ISSUES ---
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ creator: req.user._id })
      .populate("creator", "username fullName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// --- UPDATE ONLY OWN ISSUE ---
const updateIssueStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { title, description, priority, status } = req.body;

    const issue = await Issue.findOne({
      _id: issueId,
      creator: req.user._id
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found or unauthorized"
      });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        $set: {
          title: title?.trim() || issue.title,
          description: description?.trim() || issue.description,
          priority: priority ? priority.toLowerCase() : issue.priority,
          status: status ? status.toLowerCase() : issue.status
        }
      },
      { new: true, runValidators: true }
    ).populate("creator", "username fullName");

    return res.status(200).json({
      success: true,
      data: updatedIssue,
      message: "Issue updated successfully!"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// --- DELETE ONLY OWN ISSUE ---
const deleteIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const deletedIssue = await Issue.findOneAndDelete({
      _id: issueId,
      creator: req.user._id
    });

    if (!deletedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found or unauthorized"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  createIssue,
  getAllIssues,
  updateIssueStatus,
  deleteIssue
};