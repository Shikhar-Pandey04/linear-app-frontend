import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Analytics from '../components/Analytics';
import axios from '../api/axios';
import { motion } from 'framer-motion';

const Overview = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Data ---
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
      {/* Sidebar - Fixed Position */}
      <Sidebar />

      <main className="flex-1 ml-64 p-10 pt-24">
        {/* --- Header Section with Fade-in --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">
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
          <div className="space-y-16">
            {/* --- Premium Analytics Section (Total, In Progress, Done) --- */}
            <section>
                <Analytics issues={issues} />
            </section>
            
            {/* --- System Status / Welcome Card (Ultra Premium Look) --- */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative p-12 bg-[#161b22]/30 border border-slate-800/40 rounded-[3rem] overflow-hidden group"
            >
                {/* Background Glow Effect */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[80px] group-hover:bg-indigo-600/20 transition-all duration-700" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 relative">
                        <div className="w-16 h-16 bg-indigo-600/10 rounded-3xl flex items-center justify-center border border-indigo-500/20">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,1)]"></div>
                        </div>
                        <div className="absolute inset-0 w-16 h-16 bg-indigo-500/20 rounded-3xl animate-ping opacity-20"></div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">Engineered for Efficiency</h3>
                    <p className="text-slate-500 text-base max-w-lg leading-relaxed">
                        Tera workspace ekdum sync mein hai. Database mein abhi total <span className="text-indigo-400 font-bold">{issues.length} issues</span> active hain. 
                        Naye tasks manage karne ke liye <span className="text-slate-300 font-semibold italic">My Tasks</span> board ka use karo.
                    </p>
                    
                    <div className="mt-8 flex gap-4">
                        <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Node.js v20.x
                        </div>
                        <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            MongoDB Atlas Connected
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Overview;