import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react';
import SortableIssueCard from './SortableIssueCard';

const KanbanColumn = ({ id, title, issues, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: id });

  const getStatusConfig = () => {
    switch (title.toUpperCase()) {
      case 'DONE':
        return {
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
          emptyText: "No tasks completed yet",
          subText: "Great! Keep up the good work"
        };
      case 'IN PROGRESS':
        return {
          icon: <Clock size={14} className="text-amber-500" />,
          emptyText: "No tasks in progress",
          subText: "Drag tasks here to update status"
        };
      default:
        return {
          icon: <Circle size={14} className="text-indigo-500" />,
          emptyText: "No tasks to do",
          subText: "Ready to start something new?"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col min-h-[750px] bg-[#0d1117] border border-gray-800 rounded-lg p-3 transition-all ${
        isOver ? 'ring-1 ring-gray-600' : ''
      }`}
    >
      
      {/* ❌ TOP LINE REMOVED */}

      {/* --- Column Header --- */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {config.icon}
          <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <span className="bg-[#161b22] text-gray-400 text-[10px] px-2 py-0.5 rounded-md border border-gray-800">
            {issues.length}
          </span>
        </div>
      </div>

      {/* --- INNER LAYER (IMPORTANT 🔥) --- */}
      <SortableContext items={issues.map(i => i._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 bg-[#0b0f14] rounded-md p-2 flex flex-col">
          
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
            <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
              {config.emptyText}
            </div>
          )}

          {/* --- Bottom Button --- */}
          <button 
            onClick={() => onEdit?.(null)}
            className="mt-4 w-full py-3 rounded-md border border-dashed border-gray-800 hover:bg-[#161b22] text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} />
            <span className="text-[11px]">Add another task</span>
          </button>

        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;