import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye } from "lucide-react";
import API from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate();

  // 1. Ensure state is strictly empty strings
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/users/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials, bhai!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-700/20 blur-[140px] rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[520px] rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-10 shadow-[0_0_60px_rgba(37,99,235,0.08)]"
      >
        <h1 className="text-white text-5xl font-semibold text-center tracking-tight">Log in</h1>
        <p className="text-zinc-400 text-center text-sm mt-4 leading-6 max-w-sm mx-auto">
          Log in to your account and seamlessly continue managing your projects, ideas, and progress.
        </p>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-4" autoComplete="off">
          
          {/* EMAIL - Added autoComplete="off" and unique id */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              required
              name="user_email_unique" // Unique name to trick browser autofill
              autoComplete="off"       // Strictly tell browser not to autofill
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-full bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* PASSWORD - Added autoComplete="new-password" */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type={showPass ? "text" : "password"}
              required
              name="user_password_unique"
              autoComplete="new-password" // Prevents browser from filling saved passwords
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-full bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 transition"
            >
              <Eye size={18} />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold transition disabled:opacity-50 mt-2 shadow-lg"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Didn’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold hover:text-blue-400">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;