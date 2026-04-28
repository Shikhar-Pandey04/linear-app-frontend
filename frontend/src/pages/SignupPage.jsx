import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Hexagon } from "lucide-react";
import API from "../api/axios";

const SignupPage = () => {
  const navigate = useNavigate();

  // Ensuring state is strictly empty
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/users/register", formData);
      if (response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup fail ho gaya, details check karo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[950px] h-[500px] bg-blue-700/20 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[540px] rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-10 shadow-[0_0_70px_rgba(37,99,235,0.08)]"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-600/15 flex items-center justify-center mx-auto mb-6 border border-white/10">
          <Hexagon className="text-blue-500" fill="currentColor" size={28} />
        </div>

        <h1 className="text-white text-5xl font-semibold text-center tracking-tight">Create Account</h1>
        <p className="text-zinc-400 text-center text-sm mt-4 leading-6 max-w-sm mx-auto">
          Join the future of product building and create your workspace.
        </p>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* FORM - Added autoComplete="off" */}
        <form onSubmit={handleSignup} className="mt-8 space-y-4" autoComplete="off">
          
          {/* TRICK THE BROWSER: Hidden inputs to "catch" the autofill */}
          <input type="text" style={{display:'none'}} name="fake_user" />
          <input type="password" style={{display:'none'}} name="fake_pass" />

          {/* FULL NAME */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="fullName"
              type="text"
              required
              autoComplete="off"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-4 rounded-full bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* USERNAME - Unique name to prevent 'hard' from appearing */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="username"
              type="text"
              id="signup_username_unique" // Unique ID
              required
              autoComplete="off"           // Strict off
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-4 rounded-full bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-4 rounded-full bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              autoComplete="new-password" // Prevents filling old passwords
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-12 rounded-full bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 text-white font-bold transition disabled:opacity-50 mt-2 shadow-lg shadow-blue-500/20"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-7">
          Already a member?{" "}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;