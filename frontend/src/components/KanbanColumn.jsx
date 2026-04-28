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

  const getStatusConfig = () => {
    switch (title.toUpperCase()) {
      case 'DONE':
        return {
          accentColor: 'bg-emerald-500',
          borderColor: 'border-emerald-500/20',
          glow: 'shadow-[0_-4px_15px_-3px_rgba(16,185,129,0.1)]',
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
          emptyIcon: <CheckCircle2 size={32} className="text-emerald-500/10 mb-3" />,
          emptyText: "No tasks completed yet",
          subText: "Great! Keep up the good work"
        };
      case 'IN PROGRESS':
        return {
          accentColor: 'bg-amber-500',
          borderColor: 'border-amber-500/20',
          glow: 'shadow-[0_-4px_15px_-3px_rgba(245,158,11,0.1)]',
          icon: <Clock size={14} className="text-amber-500" />,
          emptyIcon: <Clock size={32} className="text-amber-500/10 mb-3" />,
          emptyText: "No tasks in progress",
          subText: "Drag tasks here to update status"
        };
      default: // TODO
        return {
          accentColor: 'bg-indigo-600',
          borderColor: 'border-indigo-500/10',
          glow: 'shadow-[0_-4px_15px_-3px_rgba(79,70,229,0.1)]',
          icon: <Circle size={14} className="text-indigo-500" />,
          emptyIcon: <Circle size={32} className="text-slate-800/40 mb-3" />,
          emptyText: "No tasks to do",
          subText: "Ready to start something new?"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      ref={setNodeRef} 
      className={`relative flex flex-col min-h-[750px] rounded-2xl bg-[#0b0e11]/60 border border-slate-800/40 transition-all duration-300 overflow-hidden ${
        isOver ? 'bg-indigo-500/5 ring-1 ring-indigo-500/20 scale-[1.01]' : ''
      } ${config.glow}`}
    >
      {/* --- CURVED Top Accent Line (Integrated with Rounded Corners) --- */}
      <div className={`absolute top-0 left-0 right-0 h-[4px] ${config.accentColor} rounded-t-2xl z-10`} />

      {/* --- Column Header --- */}
      <div className="flex items-center justify-between p-5 mb-2 mt-1">
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
      <SortableContext items={issues.map(i => i._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 flex flex-col px-3 pb-6">
          {issues.length > 0 ? (
            <div className="space-y-3">
              {issues.map((issue) => (
                <SortableIssueCard key={issue._id} issue={issue} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            /* --- Empty State --- */
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800/30 rounded-xl m-1 bg-[#161b22]/10 transition-opacity duration-500">
               <div className="p-4 bg-slate-900/40 rounded-full mb-2">
                 {config.emptyIcon}
               </div>
               <p className="text-[12px] font-bold text-slate-400 mb-1 tracking-tight">
                 {config.emptyText}
               </p>
               <p className="text-[10px] text-slate-600 font-medium">
                 {config.subText}
               </p>
            </div>
          )}

          {/* --- Bottom Add Task Button --- */}
          <button 
            onClick={() => onEdit?.(null)}
            className="mt-6 w-full py-4 rounded-xl border border-dashed border-slate-800/50 hover:border-slate-700 hover:bg-[#161b22]/40 text-slate-500 hover:text-slate-300 transition-all flex items-center justify-center gap-2 group/btn"
          >
            <Plus size={14} className="group-hover/btn:text-indigo-500 transition-colors" />
            <span className="text-[11px] font-bold tracking-tight">Add another task</span>
          </button>
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;