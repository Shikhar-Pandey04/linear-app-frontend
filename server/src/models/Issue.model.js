import mongoose, { Schema } from "mongoose";

const issueSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title toh chahiye hi bhai!"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            lowercase: true, 
            enum: {
                values: ["todo", "in-progress", "done", "backlog"],
                message: '{VALUE} is not a valid status'
            },
            default: "todo",
        },
        priority: {
            type: String,
            lowercase: true, 
            enum: {
                values: ["low", "medium", "high", "urgent"],
                message: '{VALUE} is not a valid priority'
            },
            default: "medium",
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator ID is required"], // Ye auth ke liye chahiye hota hai
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: false, // 👈 Ye hata diya! Ab bina project ke bhi task banega
            default: null
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to ensure values are cleaned before validation
issueSchema.pre('validate', function(next) {
    if (this.status) this.status = this.status.toLowerCase();
    if (this.priority) this.priority = this.priority.toLowerCase();
    next();
});

export const Issue = mongoose.model("Issue", issueSchema);