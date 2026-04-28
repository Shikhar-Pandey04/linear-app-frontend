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

      <main className="flex-1 ml-64 p-12 pt-28">
        {/* --- Header Section (Now much bigger) --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="flex h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">
              Project Insights & Performance Analytics
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-slate-500 font-bold text-lg animate-pulse">Syncing data...</div>
        ) : (
          <div className="space-y-20">
            <Analytics issues={issues} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Overview;