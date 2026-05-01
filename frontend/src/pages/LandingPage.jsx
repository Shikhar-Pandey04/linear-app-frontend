import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  const issues = [
    "ENG-135 Filter issues by team",
    "ENG-367 Add user segments",
    "ENG-284 Add personalization settings",
    "ENG-402 Add status updates",
    "ENG-338 Redesign issue overview",
    "ENG-443 Implement new search logic",
    "ENG-123 Create new dashboard",
    "ENG-421 Add data export functionality",
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative font-sans flex flex-col">

      {/* ✅ FIX 1: pointer-events-none add */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_left,rgba(80,80,255,0.08),transparent_30%)]" />

      {/* NAVBAR */}
      <nav className="max-w-[1400px] mx-auto px-8 py-6 relative z-20">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 bg-white rounded-md rotate-12 relative overflow-hidden">
            <div className="absolute w-4 h-4 bg-black rounded-full left-2 top-2" />
          </div>
          <span className="text-[15px] font-semibold">Linear</span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-grow relative z-10">
        <section className="max-w-[1400px] mx-auto px-8 pt-14">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[52px] md:text-[72px] leading-[1.03] tracking-[-0.05em] font-semibold max-w-[760px]"
          >
            Linear is a purpose-built tool for
            <br />
            planning and building products
          </motion.h1>

          <p className="text-zinc-400 text-[20px] mt-7 leading-[1.45] max-w-[620px]">
            Meet the system for modern product development.
            <br />
            Streamline issues, projects, and product roadmaps.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-10 px-5 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition"
          >
            Start building
          </button>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 pb-20 [perspective:2200px]"
          >
            <div className="-rotate-6 rounded-3xl border border-white/10 overflow-hidden bg-[#090909] shadow-[0_80px_160px_rgba(0,0,0,0.95)]">

              <div className="grid grid-cols-[220px_1fr_1fr] min-h-[520px]">

                <div className="border-r border-white/5 p-5 text-sm text-zinc-500 space-y-4">
                  <p>🏠 Inbox</p>
                  <p className="text-white">📌 My Issues</p>
                  <p>📊 Views</p>
                  <p>🚀 Initiatives</p>
                  <p>📁 Projects</p>
                  <p>👥 Teams</p>

                  <div className="pt-6 space-y-3 text-xs">
                    <p>Your teams</p>
                    <p>Design</p>
                    <p>Engineering</p>
                    <p>Product</p>
                    <p>Growth</p>
                  </div>
                </div>

                <div className="border-r border-white/5 p-6">
                  <p className="text-white text-sm mb-5 font-medium">
                    My Issues
                  </p>

                  <div className="space-y-3">
                    {issues.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/5 bg-zinc-900 px-4 py-3"
                      >
                        <p className="text-sm text-zinc-200">{item}</p>
                        <p className="text-xs text-zinc-500 mt-1">Todo</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-white font-medium mb-5">
                    Filter issues by team
                  </p>

                  <div className="space-y-4 text-sm text-zinc-400">
                    <p>☐ Todo</p>
                    <p>
                      Implement a new filter option to allow users to filter
                      issues by team.
                    </p>
                    <p>☐ Add team filter to issue page and toolbar</p>
                    <p>☐ Update issue list query to support filtering</p>
                    <p>☐ Add tests for new filtering logic</p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </section>
      </div>

      {/* ✅ FIX 2: Footer above everything */}
      <div className="relative z-50">
        <Footer />
      </div>

    </div>
  );
};

export default LandingPage;