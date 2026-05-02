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
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4 overflow-hidden">

      {/* BACKGROUND (same as login) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-black blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[440px] rounded-[28px] 
        border border-white/10 bg-white/[0.04] backdrop-blur-xl 
        px-8 py-10 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        {/* ICON */}
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
          <Hexagon className="text-white/80" size={24} />
        </div>

        <h1 className="text-white text-4xl font-semibold text-center">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center text-sm mt-4">
          Create your account and start managing your work.
        </p>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* 🔥 AUTOFILL FIX */}
        <form onSubmit={handleSignup} className="mt-8 space-y-4" autoComplete="off">

          {/* hidden inputs (chrome ko confuse karne ke liye) */}
          <input type="text" name="fakeuser" autoComplete="username" style={{ display: "none" }} />
          <input type="password" name="fakepass" autoComplete="current-password" style={{ display: "none" }} />

          {/* FULL NAME */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="fullName_unique"
              type="text"
              autoComplete="off"
              required
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-14 pl-12 rounded-full bg-black/40 border border-white/10 
              text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
            />
          </div>

          {/* USERNAME */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="username_unique"
              type="text"
              autoComplete="off"
              required
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-14 pl-12 rounded-full bg-black/40 border border-white/10 
              text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="email_unique"
              type="email"
              autoComplete="off"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-14 pl-12 rounded-full bg-black/40 border border-white/10 
              text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              name="password_unique"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-12 rounded-full bg-black/40 border border-white/10 
              text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
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
            className="w-full h-14 rounded-full bg-white/10 hover:bg-white/20 
            text-white font-semibold transition disabled:opacity-50 
            shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

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