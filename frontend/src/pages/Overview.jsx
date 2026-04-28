import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Analytics from '../components/Analytics';
import axios from '../api/axios';
import { motion } from 'framer-motion';

const Overview = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');
      setIssues(res.data.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-slate-200">
      <Sidebar />

      <main className="flex-1 ml-64 p-10 pt-24">
        {/* --- Header Section --- */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">
              Project Insights & Performance Analytics
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-slate-500 font-medium text-sm animate-pulse">Synchronizing...</div>
        ) : (
          <div className="space-y-16">
            <Analytics issues={issues} />
            
            {/* --- Status Card (Now in Professional English) --- */}
            <div className="p-12 bg-[#161b22]/30 border border-slate-800/40 rounded-[2.5rem] relative overflow-hidden group flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-indigo-600/5 blur-3xl opacity-50" />
                
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 relative z-10">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                </div>
                
                <h3 className="text-white font-bold text-2xl mb-3 relative z-10">
                  System Successfully Synchronized
                </h3>
                
                <p className="text-slate-500 text-base max-w-2xl leading-relaxed relative z-10">
                  Your workspace is fully up to date. There are currently <span className="text-indigo-400 font-bold">{issues.length} active issues</span> being tracked in the secure database. 
                  If the board appears empty, feel free to create a new issue or navigate to <span className="text-slate-300 font-semibold italic">My Tasks</span> to manage your workflow effectively.
                </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Overview;