import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Analytics from '../components/Analytics';
import axios from '../api/axios';

const Overview = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Data (Sirf stats dikhane ke liye) ---
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
    <div className="flex min-h-screen bg-[#0b0e11]">
      {/* Sidebar fixed rahega */}
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pt-20">
        {/* --- Header Section --- */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Performance and task analytics overview</p>
        </div>

        {loading ? (
          <div className="text-slate-500 italic text-sm">Loading analytics...</div>
        ) : (
          <div className="space-y-12">
            {/* --- Stats Cards (Total, Todo, In Progress, Done) --- */}
            <Analytics issues={issues} />
            
            {/* --- Welcome/Status Card --- */}
            <div className="p-10 bg-[#161b22]/50 border border-slate-800/50 rounded-3xl border-dashed flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-white font-bold text-lg">System Overview Active</h3>
                <p className="text-slate-500 text-sm max-w-xs mt-2">
                  Tera data sync ho gaya hai. Total **{issues.length} issues** tracked hain database mein. 
                  Board dekhne ke liye "My Tasks" par jao.
                </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Overview;