import { User } from "../models/User.model.js";

// --- USER REGISTER ---
const registerUser = async (req, res) => {
    try {
        const { username, email, fullName, password } = req.body;

        // 1. Validation: Check karo sab fields hain ya nahi
        if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check karo user pehle se toh nahi hai
        const existedUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existedUser) {
            return res.status(409).json({ message: "User with email or username already exists" });
        }

        // 3. Create User (Password model mein encrypt ho jayega automatically)
        const user = await User.create({
            fullName,
            email,
            password,
            username: username.toLowerCase(),
        });

        // 4. Return User details (password hatakar)
        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) {
            return res.status(500).json({ message: "Something went wrong while registering user" });
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

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // 3. Match password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        // 4. Generate Access Token
        const accessToken = user.generateAccessToken();

        // 5. User response without password
        const loggedInUser = await User.findById(user._id).select("-password");

        // 6. Cookie options (Professional/Secure way)
        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                success: true,
                user: loggedInUser,
                accessToken,
                message: "User logged in successfully! 🚀"
            });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- UPDATE USER ACCOUNT ---
const updateAccount = async (req, res) => {
    try {
        const { fullName, email, bio, avatar } = req.body;
        const userId = req.user._id; // From auth middleware

        // Validation
        if (!fullName || !email) {
            return res.status(400).json({ message: "Full name and email are required" });
        }

        // Check if email already exists (excluding current user)
        const existingUser = await User.findOne({ 
            email, 
            _id: { $ne: userId } 
        });
        
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use by another account" });
        }

        // Update user
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

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: "Account updated successfully! 🎉"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- GET CURRENT USER ---
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            data: user,
            message: "User fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, updateAccount, getCurrentUser };