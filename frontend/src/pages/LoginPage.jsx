import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import API from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate();

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
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4 overflow-hidden">

      {/* 🔥 TOP GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] 
      bg-white/10 blur-[120px] rounded-full" />

      {/* 🔥 BOTTOM FADE */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] 
      bg-black blur-[120px]" />

      {/* 🔥 DEPTH */}
      <div className="absolute inset-0 
      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_60%)]" />

      {/* 🧊 CARD */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[440px] rounded-[28px] 
        border border-white/10 
        bg-white/[0.04] backdrop-blur-xl 
        px-8 py-10 
        shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        <h1 className="text-white text-4xl font-semibold text-center tracking-tight">
          Log in
        </h1>

        <p className="text-zinc-400 text-center text-sm mt-4 leading-6 max-w-sm mx-auto">
          Log in to your account and continue your work seamlessly.
        </p>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* ✅ IMPORTANT FIX HERE */}
        <form onSubmit={handleLogin} className="mt-8 space-y-4" autoComplete="off">

          {/* 🔥 HIDDEN FIELDS (autofill breaker) */}
          <input type="text" name="fake_user" autoComplete="username" style={{ display: "none" }} />
          <input type="password" name="fake_pass" autoComplete="current-password" style={{ display: "none" }} />

          {/* EMAIL */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              name="email_unique_123"
              autoComplete="off"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-full 
              bg-black/40 border border-white/10 
              text-white placeholder:text-zinc-600 
              outline-none focus:border-white/20 transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type={showPass ? "text" : "password"}
              name="password_unique_456"
              autoComplete="new-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-full 
              bg-black/40 border border-white/10 
              text-white placeholder:text-zinc-600 
              outline-none focus:border-white/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full 
            bg-white/10 hover:bg-white/20 
            text-white font-semibold 
            transition disabled:opacity-50 
            shadow-[0_4px_20px_rgba(0,0,0,0.4)] mt-2"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* SOCIAL */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10">
              Facebook
            </button>
            <button className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10">
              Google
            </button>
            <button className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10">
              Apple
            </button>
          </div>
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