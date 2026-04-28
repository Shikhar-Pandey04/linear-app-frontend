import React from 'react';
import { Target, Zap, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, description, icon: Icon, colorClass, borderClass }) => (
  <div className={`p-6 bg-[#161b22]/70 border ${borderClass} rounded-2xl flex items-center gap-5 transition-colors duration-300 hover:bg-[#1c2128]`}>
    <div className={`p-3.5 rounded-xl bg-slate-900 ${colorClass} shadow-inner`}>
      <Icon size={20} className={colorClass.split(' ')[0]} />
    </div>

    <div className="flex flex-col">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
        {title}
      </p>
      <h3 className="text-3xl font-extrabold mt-1 text-white tracking-tight">
        {value}
      </h3>
      <p className="text-gray-700 text-[10px] font-medium mt-1">
        {description}
      </p>
    </div>
  </div>
);

const Analytics = ({ issues }) => {
  const stats = [
    {
      title: "Total Tasks",
      value: issues.length,
      description: "2.1% increase from last month. Consistent growth.",
      icon: Target,
      colorClass: "text-blue-500",
      borderClass: "border-blue-500/10",
    },
    {
      title: "In Progress",
      value: issues.filter((i) => i.status === 'IN PROGRESS').length,
      description: "Current tasks requiring immediate attention.",
      icon: Zap,
      colorClass: "text-amber-400",
      borderClass: "border-amber-500/10",
    },
    {
      title: "Completed",
      value: issues.filter((i) => i.status === 'DONE').length,
      description: "5 fewer issues compared to last week. High velocity.",
      icon: CheckCircle2,
      colorClass: "text-emerald-500",
      borderClass: "border-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default Analytics;