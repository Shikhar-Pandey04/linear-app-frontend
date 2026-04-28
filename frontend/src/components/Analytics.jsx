import React from 'react';
import { Target, Zap, CheckCircle2, MoreHorizontal } from 'lucide-react';

// --- Premium StatCard Sub-component (Layout matched to Image 1) ---
const StatCard = ({ title, value, description, icon: Icon, colorClass, borderClass }) => (
  <div className={`p-6 bg-[#161b22]/70 border ${borderClass} rounded-2xl flex items-center gap-5 transition-colors duration-300 hover:bg-[#1c2128]`}>
    {/* Icon on the Left (Matches Premium SaaS layout in Image 1) */}
    <div className={`p-3.5 rounded-xl bg-slate-900 ${colorClass} shadow-inner`}>
      <Icon size={20} className={colorClass.split(' ')[0]} />
    </div>

    {/* Text content on the Right (Matched to Image 1) */}
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
  // Statistics Calculations
  const totalTasks = issues.length;
  const inProgressTasks = issues.filter((i) => i.status === 'IN PROGRESS').length;
  const completedTasks = issues.filter((i) => i.status === 'DONE').length;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      description: "Pichle mahine se 2.1% up. Badhiya kaam chal raha hai bhai!",
      icon: Target,
      colorClass: "text-blue-500",
      borderClass: "border-blue-500/10",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      description: "Tasks requiring active focus", // Hindi description added below
      icon: Zap,
      colorClass: "text-amber-400",
      borderClass: "border-amber-500/10",
    },
    {
      title: "Completed",
      value: completedTasks,
      description: `Pichle hafte se 5 issues kam hue hain.`,
      icon: CheckCircle2,
      colorClass: "text-emerald-500",
      borderClass: "border-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-12">
      {/* --- Section 1: Premium Stat Cards Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            colorClass={stat.colorClass}
            borderClass={stat.borderClass}
          />
        ))}
      </div>

      {/* --- Section 2: Large Bottom Overview Card (Premium Style) --- */}
      {/* This replaces the "Visualization Coming Soon" with a premium card 
          while retaining your important Hindi context message.
      */}
      <div className="p-10 bg-[#161b22]/30 border border-slate-800/40 rounded-3xl relative overflow-hidden group">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full opacity-50 transition-opacity duration-700 group-hover:opacity-100" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            {/* Hourglass Icon (Linear Empty State Style) */}
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-700">
                <path d="M12 2C11.4477 2 11 2.44772 11 3V7.26C11 7.52522 11.1054 7.77956 11.2929 7.9671L12 8.6742L12.7071 7.9671C12.8946 7.77956 13 7.52522 13 7.26V3C13 2.44772 12.5523 2 12 2Z" fill="currentColor" fill-opacity="0.2"/>
                <path d="M12 22C12.5523 22 13 21.5523 13 21V16.74C13 16.4748 12.8946 16.2204 12.7071 16.0329L12 15.3258L11.2929 16.0329C11.1054 16.2204 11 16.4748 11 16.74V21C11 21.5523 11.4477 22 12 22Z" fill="currentColor"/>
                <path d="M18.7071 18.7071C19.0976 19.0976 19.0976 19.7308 18.7071 20.1213C18.3166 20.5118 17.6834 20.5118 17.2929 20.1213L15.3258 18.1542C15.1383 17.9667 15.0329 17.7123 15.0329 17.4471L15.0329 16.1542C15.0329 15.7566 14.7105 15.4342 14.3129 15.4342H9.6871C9.28954 15.4342 8.9671 15.7566 8.9671 16.1542V17.4471C8.9671 17.7123 8.8617 17.9667 8.6742 18.1542L6.70711 20.1213C6.31658 20.5118 5.68342 20.5118 5.29289 20.1213C4.90237 19.7308 4.90237 19.0976 5.29289 18.7071L7.26 16.74C7.52522 16.4748 7.77956 16.2204 7.9671 16.0329L9.6871 14.3129C10.0776 13.9224 10.0776 13.2892 9.6871 12.8987V11.1013C9.29658 10.7108 9.29658 10.0776 9.6871 9.6871L11.2929 8.08129C11.4804 7.89376 11.5858 7.63941 11.5858 7.3742L11.5858 6.08129C11.5858 5.68373 11.9082 5.36129 12.3058 5.36129H13.6942C14.0918 5.36129 14.4142 5.68373 14.4142 6.08129V7.3742C14.4142 7.63941 14.5196 7.89376 14.7071 8.08129L16.3129 9.6871C16.7034 10.0776 16.7034 10.7108 16.3129 11.1013V12.8987C15.9224 13.2892 15.9224 13.9224 16.3129 14.3129L18.0329 16.0329C18.2204 16.2204 18.3258 16.4748 18.3258 16.74L18.7071 18.7071Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>

            {/* Title Retained (Hindi Context) */}
            <h3 className="text-white font-bold text-xl mb-3 tracking-tight">
              Tera data sync ho gaya hai. Database mein <span className="text-blue-500">{issues.length} issues</span> tracked hain.
            </h3>
            
            {/* Paragraph Retained (Hindi context) */}
            <p className="text-slate-600 text-sm max-w-lg leading-relaxed">
              Agar tera board 'Empty' dikh raha hai toh ghabra mat, naya issue create karle ya fir <span className="text-slate-400 font-semibold italic">My Tasks</span> par jakar issues fetch karle bhai. Kanban board dekhne ke liye wahi button dabana padega.
            </p>
          </div>
      </div>
    </div>
  );
};

export default Analytics;
