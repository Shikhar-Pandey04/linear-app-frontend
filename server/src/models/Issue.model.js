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
        message: "{VALUE} is not a valid status",
      },
      default: "todo",
    },

    priority: {
      type: String,
      lowercase: true,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "{VALUE} is not a valid priority",
      },
      default: "medium",
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to clean values before validation
issueSchema.pre("validate", function () {
  if (this.status) this.status = this.status.toLowerCase();
  if (this.priority) this.priority = this.priority.toLowerCase();
});

export const Issue = mongoose.model("Issue", issueSchema);