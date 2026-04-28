import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        // Token nikalna (Cookie ya Header se)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Login required!" });
        }

        // Token verify karna
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Database se user nikalna
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        // Request object mein user ko 'inject' kar dena
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: error?.message || "Invalid access token" });
    }
};