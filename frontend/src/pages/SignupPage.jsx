import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Hexagon } from "lucide-react";
import API from "../api/axios";

const SignupPage = () => {
  const navigate = useNavigate();

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
      setError(
        err.response?.data?.message || "Signup fail ho gaya, details check karo!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03060f] relative flex items-center justify-center px-4 overflow-hidden">

      {/* 🔥 SAME LOGIN GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full top-[-120px] left-[-120px]" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full bottom-[-120px] right-[-120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />

      {/* 🧊 CARD */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[440px] rounded-[28px] border border-white/10 
        bg-white/[0.04] backdrop-blur-2xl px-8 py-10 
        shadow-[0_0_80px_rgba(37,99,235,0.15)]"
      >
        {/* ICON */}
        <div className="w-14 h-14 rounded-2xl bg-blue-600/15 flex items-center justify-center mx-auto mb-6 border border-white/10">
          <Hexagon className="text-blue-500" fill="currentColor" size={24} />
        </div>

        {/* TITLE */}
        <h1 className="text-white text-4xl font-semibold text-center tracking-tight">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center text-sm mt-4 leading-6">
          Join the future of product building and create your workspace.
        </p>

        {/* ERROR */}
        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-8 space-y-4" autoComplete="off">

          {/* FULL NAME */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="fullName"
              type="text"
              required
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-14 pl-12 rounded-full bg-[#0b1220] border border-white/10 
              text-white placeholder:text-zinc-500 outline-none 
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>

          {/* USERNAME */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-14 pl-12 rounded-full bg-[#0b1220] border border-white/10 
              text-white placeholder:text-zinc-500 outline-none 
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-14 pl-12 rounded-full bg-[#0b1220] border border-white/10 
              text-white placeholder:text-zinc-500 outline-none 
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-12 rounded-full bg-[#0b1220] border border-white/10 
              text-white placeholder:text-zinc-500 outline-none 
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* 🔥 BUTTON FIXED (LOGIN JESA) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-white/10 hover:bg-white/20 
            text-white font-semibold transition disabled:opacity-50 
            shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Already a member?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-400">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;