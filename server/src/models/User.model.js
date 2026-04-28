import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true, // Searching fast karne ke liye
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        avatar: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
            maxlength: 500,
        },
    },
    { timestamps: true }
);

// Password save hone se pehle use encrypt karne ke liye
// 'next' ko parameter mein rakha hai but async mein return hi kafi hota hai
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// Password check karne ke liye custom method
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Access Token generate karne ke liye custom method
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);