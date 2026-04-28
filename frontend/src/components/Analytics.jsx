import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-[#161b22] border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-slate-700 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const Analytics = ({ issues = [] }) => {
  
  // --- CRITICAL FIX: Kachra data filter out karo ---
  // Sirf wahi issues lo jo Board ke standards (UPPERCASE) par khare utarte hain
  const activeIssues = issues.filter(i => 
    ['TODO', 'IN PROGRESS', 'DONE', 'BACKLOG'].includes(i.status?.toUpperCase())
  );

  const stats = [
    { 
      title: "Total Issues", 
      // Ab ye sirf valid issues ginega, database ka purana lowercase kachra nahi
      value: activeIssues.length, 
      icon: Target, 
      colorClass: "text-indigo-500" 
    },
    { 
      title: "In Progress", 
      value: activeIssues.filter(i => i.status === 'IN PROGRESS').length, 
      icon: Zap, 
      colorClass: "text-amber-400" 
    },
    { 
      title: "Completed", 
      value: activeIssues.filter(i => i.status === 'DONE').length, 
      icon: CheckCircle2, 
      colorClass: "text-emerald-500" 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard 
            key={i} 
            title={s.title} 
            value={s.value} 
            icon={s.icon} 
            colorClass={s.colorClass} 
          />
        ))}
      </div>

      {/* Analytics Visualization Placeholder */}
      <div className="h-64 bg-[#161b22]/40 border border-slate-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-700 group">
          <motion.span 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-3"
          >
            📊
          </motion.span>
          <p className="italic font-bold text-xs uppercase tracking-widest text-slate-500">
            Analytics Visualization Coming Soon
          </p>
          <p className="text-[10px] mt-2 text-slate-600 font-medium">
            Charts, burn-down, and velocity tracking.
          </p>
      </div>
    </motion.div>
  );
};

export default Analytics;