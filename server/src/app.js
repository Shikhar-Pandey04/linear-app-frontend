import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary'; // 👈 1. Cloudinary import karo

const app = express();

// --- Cloudinary Configuration ---
// Ye part sabse zaruri hai, warna controller upload nahi kar payega
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// --- Middlewares ---

// CORS Policy for Production/Local
app.use(cors({ 
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", 
    credentials: true 
}));

app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Isse 'public/temp' access ho payega
app.use(cookieParser());


// --- Routes Import ---
import issueRouter from "./routes/issue.routes.js";
import userRouter from "./routes/user.routes.js";


// --- Routes Declaration ---
app.use("/api/v1/issues", issueRouter); 
app.use("/api/v1/users", userRouter); 


export { app };