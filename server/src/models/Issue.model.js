import mongoose, { Schema } from "mongoose";

const issueSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done", "backlog"],
            default: "todo",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        // Ye dono fields AI ne add karne ko boli thi
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Issue = mongoose.model("Issue", issueSchema);