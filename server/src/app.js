import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --- Middlewares ---

// Pehle ye hardcoded localhost tha, ab ye Render ke Environment Variables se link uthayega.
// Agar link nahi mila, toh safety ke liye localhost use karega.
app.use(cors({ 
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", 
    credentials: true 
}));

app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser()); // Browser cookies read/write karne ke liye


// --- Routes Import ---
import issueRouter from "./routes/issue.routes.js";
import userRouter from "./routes/user.routes.js"; // User Signup/Login ke liye


// --- Routes Declaration ---
app.use("/api/v1/issues", issueRouter); 
app.use("/api/v1/users", userRouter); 


export { app };