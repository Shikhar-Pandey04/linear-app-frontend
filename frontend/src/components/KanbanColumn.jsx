import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Plus, Circle, Clock, CheckCircle2, Calendar } from 'lucide-react';
import SortableIssueCard from './SortableIssueCard';

const KanbanColumn = ({ id, title, issues, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: id });

  // --- Status Wise Config (Colors & Icons) ---
  const getStatusConfig = () => {
    switch (title.toUpperCase()) {
      case 'DONE':
        return {
          accentColor: 'bg-emerald-500',
          borderColor: 'border-emerald-500/20',
          glowColor: 'shadow-emerald-500/10',
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
          emptyIcon: <CheckCircle2 size={32} className="text-emerald-500/20 mb-3" />,
          emptyText: "No tasks completed yet",
          subText: "Great! Keep up the good work"
        };
      case 'IN PROGRESS':
        return {
          accentColor: 'bg-amber-500',
          borderColor: 'border-amber-500/20',
          glowColor: 'shadow-amber-500/10',
          icon: <Clock size={14} className="text-amber-500" />,
          emptyIcon: <Clock size={32} className="text-amber-500/20 mb-3" />,
          emptyText: "No tasks in progress",
          subText: "Drag tasks here to update status"
        };
      default: // TODO
        return {
          accentColor: 'bg-indigo-600',
          borderColor: 'border-indigo-600/20',
          glowColor: 'shadow-indigo-600/10',
          icon: <Circle size={14} className="text-indigo-500" />,
          emptyIcon: <Circle size={32} className="text-slate-800 mb-3" />,
          emptyText: "No tasks to do",
          subText: "Ready to start something new?"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      ref={setNodeRef} 
      className={`relative flex flex-col min-h-[750px] rounded-2xl bg-[#0b0e11]/50 border ${config.borderColor} transition-all duration-300 ${
        isOver ? 'bg-indigo-500/5 ring-1 ring-indigo-500/20' : ''
      } ${config.glowColor} shadow-2xl`}
    >
      {/* --- Top Accent Line (Ye wahi hai jo tumne manga tha) --- */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${config.accentColor} rounded-t-2xl opacity-80`} />

      {/* --- Column Header --- */}
      <div className="flex items-center justify-between p-5 mb-2">
        <div className="flex items-center gap-3">
          {config.icon}
          <h3 className="text-[12px] font-bold text-slate-200 uppercase tracking-widest">
            {title}
          </h3>
          <span className="bg-slate-800/50 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold border border-slate-700/30">
            {issues.length}
          </span>
        </div>
      </div>

      {/* --- Sortable Context --- */}
      <SortableContext 
        items={issues.map(i => i._id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 flex flex-col px-3 pb-4">
          {issues.length > 0 ? (
            <div className="space-y-3">
              {issues.map((issue) => (
                <SortableIssueCard 
                  key={issue._id} 
                  issue={issue} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))}
            </div>
          ) : (
            /* --- Empty State (Centered as per Image) --- */
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800/40 rounded-xl m-1 bg-[#161b22]/10">
               {config.emptyIcon}
               <p className="text-xs font-bold text-slate-400 mb-1 tracking-tight">
                 {config.emptyText}
               </p>
               <p className="text-[10px] text-slate-600 font-medium">
                 {config.subText}
               </p>
            </div>
          )}

          {/* --- Add Another Task Button (Bottom style) --- */}
          <button 
            onClick={() => onEdit?.(null)}
            className="mt-4 w-full py-4 rounded-xl border border-dashed border-slate-800/50 hover:border-slate-700 hover:bg-[#161b22]/30 text-slate-500 hover:text-slate-300 transition-all flex items-center justify-center gap-2 group/btn"
          >
            <Calendar size={14} className="group-hover/btn:text-indigo-500 transition-colors" />
            <span className="text-[11px] font-bold">+ Add another task</span>
          </button>
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;