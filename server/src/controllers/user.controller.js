import { User } from "../models/User.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// --- 🚀 NEW: UPLOAD AVATAR (Cloudinary Logic) ---
const uploadAvatar = async (req, res) => {
    try {
        // 1. Check karo file aayi hai ya nahi (Multer req.file mein deta hai)
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        // 2. Cloudinary par upload karo
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatars", // Cloudinary mein 'avatars' folder ban jayega
            resource_type: "image",
        });

        // 3. Local temp file ko delete karo (Zaruri hai!)
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // 4. Client ko Cloudinary ka Secure URL bhej do
        return res.status(200).json({
            success: true,
            data: { avatar: result.secure_url },
            message: "Avatar uploaded to cloud successfully! 📸"
        });

    } catch (error) {
        // Agar fail ho jaye toh bhi local file delete karni hai
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Cloudinary Error:", error);
        return res.status(500).json({ success: false, message: "Failed to upload to cloud" });
    }
};

// --- USER REGISTER ---
const registerUser = async (req, res) => {
    try {
        const { username, email, fullName, password } = req.body;

        if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existedUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existedUser) {
            return res.status(409).json({ message: "User with email or username already exists" });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            username: username.toLowerCase(),
        });

        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) {
            return res.status(500).json({ message: "Registration failed on server" });
        }

        return res.status(201).json({
            success: true,
            data: createdUser,
            message: "User registered successfully! 🎉"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- USER LOGIN ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = user.generateAccessToken();
        const loggedInUser = await User.findById(user._id).select("-password");

        const options = { httpOnly: true, secure: true };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                success: true,
                user: loggedInUser,
                accessToken,
                message: "Logged in successfully! 🚀"
            });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- UPDATE USER ACCOUNT ---
const updateAccount = async (req, res) => {
    try {
        const { fullName, email, bio, avatar } = req.body;
        const userId = req.user._id;

        if (!fullName || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fullName,
                    email,
                    bio: bio || "",
                    avatar: avatar || "" // Frontend se aaya naya Cloudinary URL yahan save hoga
                }
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: "Account updated! 🎉"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- GET CURRENT USER ---
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            success: true,
            data: user,
            message: "User fetched"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, updateAccount, getCurrentUser, uploadAvatar };