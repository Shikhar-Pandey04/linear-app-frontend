import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Analytics from '../components/Analytics';
import axios from '../api/axios';

const Overview = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Issues ---
  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');
      setIssues(res.data.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-slate-200">
      {/* Sidebar fixed rahega */}
      <Sidebar />

      <main className="flex-1 ml-64 p-10 pt-24">
        {/* --- Header Section (Matches Image 2 Branded Look) --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            {/* Indigo Pulse Indicator */}
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <p className="text-slate-500 font-semibold tracking-wide text-sm uppercase">
              Real-time project insights & performance
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center gap-3 text-slate-500 italic">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            Syncing analytics...
          </div>
        ) : (
          <div className="relative">
            {/* Subtle Background Glow (Linear Style) */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-[128px] pointer-events-none" />

            {/* --- Premium Analytics Section (NO Dashed Box) --- */}
            <section className="relative z-10">
                <Analytics issues={issues} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Overview;