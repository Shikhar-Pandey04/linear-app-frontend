import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Plus, Circle, Clock, CheckCircle2, MoreHorizontal } from 'lucide-react'; // Icons
import SortableIssueCard from './SortableIssueCard';

const KanbanColumn = ({ id, title, issues, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: id });

  // --- Dynamic Content based on Status ---
  const getStatusConfig = () => {
    switch (title.toUpperCase()) {
      case 'DONE':
        return {
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
          emptyIcon: <CheckCircle2 size={32} className="text-emerald-500/20 mb-2" />,
          emptyText: "All caught up!",
          colorClass: "bg-emerald-500"
        };
      case 'IN PROGRESS':
        return {
          icon: <Clock size={14} className="text-amber-500" />,
          emptyIcon: <Clock size={32} className="text-amber-500/20 mb-2" />,
          emptyText: "No tasks in progress",
          colorClass: "bg-amber-500"
        };
      default: // TODO
        return {
          icon: <Circle size={14} className="text-slate-500" />,
          emptyIcon: <Circle size={32} className="text-slate-800 mb-2" />,
          emptyText: "No tasks yet",
          colorClass: "bg-slate-500"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col min-h-[700px] rounded-2xl transition-all duration-300 ${
        isOver ? 'bg-indigo-500/5 ring-2 ring-indigo-500/20' : 'bg-transparent'
      }`}
    >
      {/* --- Column Header --- */}
      <div className="flex items-center justify-between mb-4 px-2 group">
        <div className="flex items-center gap-2.5">
          {config.icon}
          <h3 className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-[11px] font-medium text-slate-600 ml-1">
            {issues.length}
          </span>
        </div>
        <button className="text-slate-700 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
           <MoreHorizontal size={16} />
        </button>
      </div>

      {/* --- Sortable Context --- */}
      <SortableContext 
        items={issues.map(i => i._id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 flex flex-col gap-3">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <SortableIssueCard 
                key={issue._id} 
                issue={issue} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))
          ) : (
            /* --- Sexy Empty State Placeholder --- */
            <div className="flex-1 min-h-[150px] border border-dashed border-slate-800/40 rounded-xl flex flex-col items-center justify-center p-6 bg-[#161b22]/20">
               {config.emptyIcon}
               <p className="text-[11px] text-slate-600 font-medium uppercase tracking-widest text-center">
                 {config.emptyText}
               </p>
            </div>
          )}

          {/* --- Linear Style Footer Button --- */}
          <button 
            onClick={() => onEdit?.(null)} // Naya issue modal kholne ke liye
            className="w-full py-3 rounded-xl border border-transparent hover:border-slate-800/60 hover:bg-[#161b22]/40 text-slate-600 hover:text-slate-300 transition-all flex items-center justify-start px-4 gap-3 group/btn mt-1"
          >
            <Plus size={16} className="group-hover/btn:text-indigo-500 transition-colors" />
            <span className="text-xs font-medium">Add another task</span>
          </button>
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;