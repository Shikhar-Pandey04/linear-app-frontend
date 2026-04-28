import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Trash2, Edit3 } from 'lucide-react';

const SortableIssueCard = ({ issue, onEdit, onDelete }) => {
    // dnd-kit hooks for drag and drop logic
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: issue._id });

    // Dragging style setup
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.3 : 1, // Drag karte waqt card halka dikhega
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout // 👈 Magic for smooth reordering animations
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2, borderColor: '#4b5563' }} // Hover par halka sa uthega
            className="group relative p-4 bg-[#161b22] border border-slate-800 rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:shadow-purple-500/5 transition-colors"
            {...attributes}
            {...listeners}
        >
            {/* --- Hover Actions Menu --- */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Drag trigger na ho jaye
                        onEdit(issue);
                    }}
                    className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded text-gray-400 hover:text-blue-400 transition-all"
                >
                    <Edit3 size={14} />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(issue._id);
                    }}
                    className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded text-gray-400 hover:text-red-400 transition-all"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* --- Card Content --- */}
            <div className="flex justify-between items-start mb-2 pr-14">
                <h4 className="text-[13px] font-medium text-gray-200 leading-snug">
                    {issue.title}
                </h4>
            </div>

            <p className="text-[12px] text-gray-500 line-clamp-2 mt-1 mb-4">
                {issue.description}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Priority Badge */}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold border ${
                        issue.priority === 'high' 
                        ? 'border-red-500/20 text-red-500 bg-red-500/5' 
                        : issue.priority === 'medium'
                        ? 'border-orange-500/20 text-orange-500 bg-orange-500/5'
                        : 'border-blue-500/20 text-blue-500 bg-blue-500/5'
                    }`}>
                        {issue.priority.toUpperCase()}
                    </span>
                    
                    {/* User Avatar Initial */}
                    <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-gray-300 font-bold">
                        {issue.creator?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>

                <span className="text-[10px] text-gray-700 font-mono italic">
                    #{issue._id.slice(-4)}
                </span>
            </div>
        </motion.div>
    );
};

export default SortableIssueCard;