import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import SortableIssueCard from './SortableIssueCard';

const KanbanColumn = ({ id, title, issues, onEdit, onDelete }) => {
  
  // Is column ko "Droppable" area banane ke liye hook
  const { setNodeRef, isOver } = useDroppable({
    id: id, // Ye status (TODO, DONE etc.) hi hai
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col min-h-[600px] rounded-2xl p-4 transition-colors duration-200 ${
        isOver ? 'bg-indigo-500/5 border-2 border-dashed border-indigo-500/40' : 'bg-[#0b0e11]/50 border border-slate-800/50'
      }`}
    >
      {/* --- Column Header --- */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          {/* Status Indicators (Colors) */}
          <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
            title === 'DONE' ? 'bg-emerald-500' : 
            title === 'IN PROGRESS' ? 'bg-amber-500' : 'bg-slate-500'
          }`}></span>
          
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {title}
          </h3>
        </div>

        {/* Issue Count Badge */}
        <span className="text-[10px] font-bold text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded-md border border-slate-700/30">
          {issues.length}
        </span>
      </div>

      {/* --- Sortable Context for Cards --- */}
      <SortableContext 
        items={issues.map(i => i._id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3">
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
            // Empty State Placeholder
            <div className="h-20 border border-dashed border-slate-800/30 rounded-xl flex items-center justify-center">
               <p className="text-[10px] text-slate-700 italic uppercase tracking-widest font-bold">
                 No Tasks
               </p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;