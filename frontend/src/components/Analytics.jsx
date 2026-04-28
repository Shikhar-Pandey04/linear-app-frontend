import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, CheckCircle2, TrendingUp } from 'lucide-react';

// StatCard with Premium Design from Image 2
const StatCard = ({ title, value, icon: Icon, colorClass, borderClass, glowClass, waveColor }) => (
  <div className={`relative flex-1 p-7 bg-[#161b22]/40 border ${borderClass} rounded-3xl overflow-hidden group transition-all duration-500 hover:scale-[1.03] ${glowClass}`}>
    
    {/* --- Sparkline Wave Background (Subtle linear design) --- */}
    <div className={`absolute bottom-0 right-0 w-36 opacity-10 group-hover:opacity-30 transition-opacity duration-700 ${waveColor}`}>
      <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M0 30Q15 35 30 15T60 20T100 5" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round"
          className="drop-shadow-lg"
        />
      </svg>
    </div>

    <div className="flex items-start gap-6 relative z-10">
      {/* Modern Icon with Glassmorphism Effect */}
      <div className={`p-4 rounded-2xl bg-slate-900/80 border border-white/5 shadow-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${colorClass}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col">
        <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.25em]">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h2 className="text-4xl font-black text-white tracking-tighter">{value}</h2>
          <span className="text-[10px] text-slate-600 font-bold flex items-center gap-0.5">
            <TrendingUp size={10} /> +2.5%
          </span>
        </div>
        <p className="text-slate-600 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          Live Database Sync
        </p>
      </div>
    </div>
  </div>
);

const Analytics = ({ issues = [] }) => {
  
  // --- CRITICAL FIX: Kachra data filter out karo ---
  const activeIssues = issues.filter(i => 
    ['TODO', 'IN PROGRESS', 'DONE', 'BACKLOG'].includes(i.status?.toUpperCase())
  );

  const stats = [
    { 
      title: "Total Tasks", 
      value: activeIssues.length, 
      icon: Target, 
      colorClass: "text-indigo-500",
      borderClass: "border-indigo-500/10",
      glowClass: "hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)]",
      waveColor: "text-indigo-500"
    },
    { 
      title: "In Progress", 
      value: activeIssues.filter(i => i.status === 'IN PROGRESS').length, 
      icon: Zap, 
      colorClass: "text-amber-400",
      borderClass: "border-amber-500/10",
      glowClass: "hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]",
      waveColor: "text-amber-400"
    },
    { 
      title: "Completed", 
      value: activeIssues.filter(i => i.status === 'DONE').length, 
      icon: CheckCircle2, 
      colorClass: "text-emerald-500",
      borderClass: "border-emerald-500/10",
      glowClass: "hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]",
      waveColor: "text-emerald-500"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full space-y-12"
    >
      {/* Stats Cards Grid (Matches Image 2 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
    </motion.div>
  );
};

export default Analytics;