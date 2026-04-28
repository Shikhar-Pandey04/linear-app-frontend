import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass, glowClass }) => (
  <div className={`relative flex-1 p-8 bg-[#161b22]/50 border ${borderClass} rounded-[2.5rem] transition-all duration-500 hover:scale-[1.05] ${glowClass} shadow-2xl`}>
    
    <div className="flex items-center gap-6 relative z-10">
      {/* Big Icon Container with Premium Border */}
      <div className={`p-5 rounded-2xl bg-slate-900 border border-white/5 shadow-inner ${colorClass}`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col">
        {/* Uppercase Label - Scaled up for readability */}
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-1">
          {title}
        </p>
        {/* Big Bold Value - World Class Typography */}
        <h2 className="text-6xl font-black text-white tracking-tighter">
          {value}
        </h2>
      </div>
    </div>
    
    {/* Subtle Background Glow for each card */}
    <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-20 rounded-full ${colorClass.split(' ')[0].replace('text-', 'bg-')}`}></div>
  </div>
);

const Analytics = ({ issues = [] }) => {
  
  // --- CRITICAL FILTER: Database ka lowercase kachra hatao ---
  // Sirf vahi issues count honge jo Board par valid hain
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
      glowClass: "hover:shadow-indigo-500/10"
    },
    { 
      title: "In Progress", 
      value: activeIssues.filter(i => i.status?.toUpperCase() === 'IN PROGRESS').length, 
      icon: Zap, 
      colorClass: "text-amber-400",
      borderClass: "border-amber-500/10",
      glowClass: "hover:shadow-amber-500/10"
    },
    { 
      title: "Completed", 
      value: activeIssues.filter(i => i.status?.toUpperCase() === 'DONE').length, 
      icon: CheckCircle2, 
      colorClass: "text-emerald-500",
      borderClass: "border-emerald-500/10",
      glowClass: "hover:shadow-emerald-500/10"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      {/* Stats Cards Grid - Large Gap for Premium feel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {stats.map((s, i) => (
          <StatCard 
            key={i} 
            title={s.title} 
            value={s.value} 
            icon={s.icon} 
            colorClass={s.colorClass} 
            borderClass={s.borderClass}
            glowClass={s.glowClass}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Analytics;