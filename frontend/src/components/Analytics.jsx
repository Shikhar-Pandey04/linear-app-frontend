import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass, glowClass }) => (
  <div className={`relative flex-1 p-6 bg-[#161b22]/50 border ${borderClass} rounded-2xl transition-all duration-300 hover:bg-[#1c2128] ${glowClass}`}>
    
    <div className="flex items-center gap-5 relative z-10">
      {/* Balanced Icon Container */}
      <div className={`p-4 rounded-xl bg-slate-900 border border-white/5 ${colorClass}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">
          {title}
        </p>
        <h2 className="text-4xl font-black text-white tracking-tighter">
          {value}
        </h2>
      </div>
    </div>
  </div>
);

const Analytics = ({ issues = [] }) => {
  const activeIssues = issues.filter(i => 
    ['TODO', 'IN PROGRESS', 'DONE'].includes(i.status?.toUpperCase())
  );

  const stats = [
    { 
      title: "Total Tasks", 
      value: activeIssues.length, 
      icon: Target, 
      colorClass: "text-indigo-500",
      borderClass: "border-indigo-500/10",
      glowClass: "hover:shadow-indigo-500/5"
    },
    { 
      title: "In Progress", 
      value: activeIssues.filter(i => i.status?.toUpperCase() === 'IN PROGRESS').length, 
      icon: Zap, 
      colorClass: "text-amber-400",
      borderClass: "border-amber-500/10",
      glowClass: "hover:shadow-amber-500/5"
    },
    { 
      title: "Completed", 
      value: activeIssues.filter(i => i.status?.toUpperCase() === 'DONE').length, 
      icon: CheckCircle2, 
      colorClass: "text-emerald-500",
      borderClass: "border-emerald-500/10",
      glowClass: "hover:shadow-emerald-500/5"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
    >
      {stats.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </motion.div>
  );
};

export default Analytics;