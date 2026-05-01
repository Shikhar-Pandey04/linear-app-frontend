import { User } from "../models/User.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// --- 🚀 UPLOAD AVATAR ---
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        // Cloudinary upload
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatars",
            resource_type: "image",
        });

        // Local temp file delete
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // 🔥 Save avatar in DB
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    avatar: result.secure_url
                }
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: "Avatar uploaded successfully! 📸"
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// --- USER REGISTER ---
const registerUser = async (req, res) => {
    try {
        const { username, email, fullName, password } = req.body;

        if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            return res.status(409).json({
                success: false,
                message: "User with email or username already exists"
            });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            username: username.toLowerCase(),
        });

        const createdUser = await User.findById(user._id).select("-password");

        return res.status(201).json({
            success: true,
            data: createdUser,
            message: "User registered successfully! 🎉"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// --- USER LOGIN ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const accessToken = user.generateAccessToken();

        const loggedInUser = await User.findById(user._id).select("-password");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                success: true,
                user: loggedInUser,
                accessToken,
                message: "Logged in successfully! 🚀"
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// --- UPDATE ACCOUNT ---
const updateAccount = async (req, res) => {
    try {
        const { fullName, email, bio, avatar } = req.body;
        const userId = req.user._id;

        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: userId }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already in use"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fullName,
                    email,
                    bio: bio || "",
                    avatar: avatar || ""
                }
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: "Account updated successfully! 🎉"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// --- GET CURRENT USER ---
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
            message: "User fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    registerUser,
    loginUser,
    updateAccount,
    getCurrentUser,
    uploadAvatar
};